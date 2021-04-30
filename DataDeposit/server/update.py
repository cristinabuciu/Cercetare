# update.py
from application_properties import *
from upload import findUserID, getCoordinates

import os
import sys
from datetime import datetime, timedelta
import es_connector
import ckan_connector as ck
from time import sleep, time


def updateDataset(dataset_id, params, current_user):
    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        existingDataset = es.get_es_data_by_id(INDEX_DATASETS, dataset_id)[0]
        existingDataset_ES_ID = existingDataset['_id']
        existingDataset = existingDataset['_source']

        current_userID = findUserID(current_user)
        if current_user != existingDataset['owner'] or int(current_userID) != existingDataset['ownerId']:
            return "SKIP_UPDATE_DATASET_WRONG_USER"

        new_dataset = {}
        new_dataset['private'] = params['private']
        new_dataset['owner'] = existingDataset['owner']
        new_dataset['ownerId'] = existingDataset['ownerId']

        for key, value in params['notArrayParams'].items():
            new_dataset[key] = value

        for key, value in params['arrayParams'].items():
            new_dataset[key] = value

        new_dataset['tags'] = list(map(lambda x: x['value'], new_dataset['tags']))

        new_dataset['id'] = dataset_id
        new_dataset['updates_number'] = existingDataset['updates_number'] + 1
        new_dataset['downloads_number'] = existingDataset['downloads_number']
        new_dataset['avg_rating_value'] = existingDataset['avg_rating_value']
        new_dataset['ratings_number'] = existingDataset['ratings_number']
        new_dataset['views'] = existingDataset['views']
        new_dataset['geo_coord'] = getCoordinates(params['notArrayParams']['country'])
        new_dataset['date'] = existingDataset['date']
        new_dataset['lastUpdatedAt'] = str(int(time()))

        new_dataset['ckan_package_id'] = existingDataset['ckan_package_id']
        new_dataset['ckan_resource_id'] = existingDataset['ckan_resource_id']
        new_dataset['downloadPath'] = existingDataset['downloadPath']

        new_dataset['deleted'] = False
        new_dataset['deletedAt'] = -1

        es.update(INDEX_DATASETS, '_doc', existingDataset_ES_ID, new_dataset, WAIT_FOR)

        ### UPDATE DOMAINS
        domain = params['notArrayParams']['domain'].upper()

        isDomainNew = not(es.get_es_data_by_domainName(INDEX_DOMAINS, domain))
        if isDomainNew:
            es.insert(INDEX_DOMAINS, '_doc', {"domainName": domain})

        ### UPDATE TAGS
        tags = params['arrayParams']['tags']

        if not(isDomainNew):
            for tag in tags:
                tagName = tag['value'].lower()
                tagName = tagName.capitalize()
                isTagNew = not(es.get_es_data_by_domainName_and_tagName(INDEX_TAGS, domain, tagName))

                if isTagNew:
                    es.insert(INDEX_TAGS, '_doc', {"domainName": domain, "tagName": tagName})
        else:
            for tag in tags:
                tagName = tag['value'].lower()
                tagName = tagName.capitalize()
                es.insert(INDEX_TAGS, '_doc', {"domainName": domain, "tagName": tagName})

        # ckan package update
        packageId = existingDataset['ckan_package_id']
        updateDatasetToCkanInstance(packageId, new_dataset)

        return {'datasetId': dataset_id, 'packageId': packageId}

    except:
        return "UPDATE_DATASET_ERROR"


def updateDatasetToCkanInstance(packageId, dataset):
    group = dataset['domain'].replace(" ", "-").lower()
    ck.createGroupIfNeeded(group)

    ckanMetadata = ck.getPackage(packageId)

    ckanMetadata['title'] = dataset['dataset_title']
    ckanMetadata['name'] = str(dataset['id'])
    ckanMetadata['private'] = dataset['private']
    ckanMetadata['author'] = ', '.join(dataset['authors'])
    ckanMetadata['maintainer'] = dataset['owner']
    ckanMetadata['notes'] = dataset['short_desc']
    ckanMetadata['groups'] = [{'name': group}]
    ckanMetadata['tags'] = list(map(lambda tag: {'name': tag}, dataset['tags']))
    ckanMetadata['owner_org'] = CKAN_INSTANCE_ORG_ID

    if dataset['gitlink']:
        ckanMetadata['url'] = dataset['gitlink']

    # todo: add extras if needed (ckanMetadata['extras'] = [{'key': 'value'}]

    return ck.updatePackage(packageId, ckanMetadata)


def updateDatasetFiles(datasetId, packageId, file):
    if not(file) or file.filename == '' or not(allowed_file(file.filename)):
        return "FILE_NOT_ALLOWED"

    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]['_source']

        if dataset['ckan_package_id'] != packageId:
            return "SKIP_UPDATE_FILES_WRONG_PACKAGE_ID"

        resourceId = dataset['ckan_resource_id']

        # ckan resource update
        filename = file.filename.split('.')[0]
        resource_data = {}
        resource_data['id'] = resourceId
        resource_data['name'] = filename
        resource_data['url'] = '{}/files'.format(datasetId)

        resourceUrl = ck.updateResource(resource_data, file)

        # update dataset - update resource url
        existing = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]
        esId = existing['_id']
        existing = existing['_source']
        existing['downloadPath'] = resourceUrl
        es.update(INDEX_DATASETS, '_doc', esId, existing, WAIT_FOR)

        return {'datasetId': datasetId, 'packageId': packageId, 'resourceId': resourceId}

    except Exception as e:
        print(e)
        return "UPLOAD_DATASET_FILES_ERROR"


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in UPLOAD_FILE_ALLOWED_EXTENSIONS