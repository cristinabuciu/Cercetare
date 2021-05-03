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


def updateDatasetFilesToNone(datasetId):
    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]
        esId = dataset['_id']
        dataset = dataset['_source']

        # cleanup external
        dataset['downloadPath'] = ''

        # cleanup internal
        deleteCkanResourceIfNeeded(dataset)

        dataset['updates_number'] += 1
        dataset['lastUpdatedAt'] = str(int(time()))
        dataset['downloads_number'] = 0

        es.update(INDEX_DATASETS, '_doc', esId, dataset, WAIT_FOR)

        return "UPDATE_DATASET_FILES_SUCCESS"

    except Exception as e:
        print(e)
        return "UPDATE_DATASET_FILES_ERROR"


def updateDatasetFilesToExternal(datasetId, downloadUrl):
    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]
        esId = dataset['_id']
        dataset = dataset['_source']

        # setup external
        dataset['downloadPath'] = downloadUrl

        # cleanup internal
        deleteCkanResourceIfNeeded(dataset)

        dataset['updates_number'] += 1
        dataset['lastUpdatedAt'] = str(int(time()))
        dataset['downloads_number'] = 0

        es.update(INDEX_DATASETS, '_doc', esId, dataset, WAIT_FOR)

        return "UPDATE_DATASET_FILES_SUCCESS"

    except Exception as e:
        print(e)
        return "UPDATE_DATASET_FILES_ERROR"


def deleteCkanResourceIfNeeded(dataset):
    if 'ckan_resource_id' in dataset and dataset['ckan_resource_id'] != '':
        ck.deleteResource(dataset['ckan_resource_id'])
        dataset['ckan_resource_id'] = ''

        print("Ckan resource has been deleted. datasetId={}".format(dataset['id']))
    else:
        print("No ckan resource to delete. datasetId={}".format(dataset['id']))


def updateDatasetFilesToInternal(datasetId, file):
    if not file or file.filename == '' or not(allowed_file(file.filename)):
        return "FILE_NOT_ALLOWED"

    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]
        esId = dataset['_id']
        dataset = dataset['_source']

        # cleanup external
        dataset['downloadPath'] = ''

        # setup internal
        if 'ckan_resource_id' in dataset and dataset['ckan_resource_id'] != '':
            # update resource
            resourceId = dataset['ckan_resource_id']
            resource_data = {
                'id': resourceId,
                'name': file.filename.split('.')[0],
                'url': '{}/files'.format(datasetId)
            }

            resourceUrl = ck.updateResource(resource_data, file)
            dataset['downloadPath'] = resourceUrl
        else:
            # add resource
            packageId = dataset['ckan_package_id']

            resource_data = {
                'package_id': packageId,
                'name': file.filename.split('.')[0],
                'url': '{}/files'.format(datasetId)
            }

            resourceId, resourceUrl = ck.addResource(resource_data, file)
            dataset['ckan_resource_id'] = resourceId
            dataset['downloadPath'] = resourceUrl

        dataset['updates_number'] += 1
        dataset['lastUpdatedAt'] = str(int(time()))
        dataset['downloads_number'] = 0

        es.update(INDEX_DATASETS, '_doc', esId, dataset, WAIT_FOR)

        return "UPDATE_DATASET_FILES_SUCCESS"

    except Exception as e:
        print(e)
        return "UPDATE_DATASET_FILES_ERROR"


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in UPLOAD_FILE_ALLOWED_EXTENSIONS


def increaseDownloadsNumber(dataset_id):
    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        es.update_dataset_downloads(INDEX_DATASETS, int(dataset_id))

    except Exception as e:
        print(e)
        return "INCREASE_DOWNLOADS_ERROR"
