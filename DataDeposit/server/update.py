# update.py
from application_properties import INDEX_DATASETS, INDEX_DOMAINS, INDEX_TAGS, CKAN_INSTANCE_ORG_ID, UPLOAD_FILE_SIZE_MAX
from utils import getCountryCoordinates, isFileAllowed, createResponse, getTransaction, getFileSize, getFileChecksumChunks, getFileFormat
from search import getUserIdByName
from constants import WAIT_FOR

from time import time
from http import HTTPStatus

import ckan_connector as ck


def updateDataset(dataset_id, params, current_user):
    try:
        es = getTransaction()

        existing = es.get_es_data_by_id(INDEX_DATASETS, dataset_id)[0]
        existingDataset_ES_ID = existing['_id']
        existing = existing['_source']

        current_userID = getUserIdByName(current_user)
        if current_user != existing['owner'] or int(current_userID) != int(existing['ownerId']):
            return createResponse(HTTPStatus.BAD_REQUEST, "SKIP_UPDATE_DATASET_WRONG_USER")

        new_dataset = {
            'private': params['private'],
            'owner': existing['owner'],
            'ownerId': existing['ownerId']
        }

        for key, value in params['notArrayParams'].items():
            new_dataset[key] = value

        for key, value in params['arrayParams'].items():
            new_dataset[key] = value

        new_dataset['tags'] = list(map(lambda x: x['value'], new_dataset['tags']))

        new_dataset['id'] = dataset_id
        new_dataset['updates_number'] = existing['updates_number'] + 1
        new_dataset['downloads_number'] = existing['downloads_number']
        new_dataset['avg_rating_value'] = existing['avg_rating_value']
        new_dataset['ratings_number'] = existing['ratings_number']
        new_dataset['views'] = existing['views']
        new_dataset['geo_coord'] = getCountryCoordinates(es, params['notArrayParams']['country'])
        new_dataset['date'] = existing['date']
        new_dataset['lastUpdatedAt'] = str(int(time()))
        new_dataset['downloadPath'] = existing['downloadPath']
        new_dataset['data_format'] = existing['data_format']

        new_dataset['ckan_package_id'] = existing['ckan_package_id']
        if 'ckan_resource_id' in existing:
            new_dataset['ckan_resource_id'] = existing['ckan_resource_id']
        if 'file_checksum' in existing:
            new_dataset['file_checksum'] = existing['file_checksum']

        new_dataset['deleted'] = False
        new_dataset['deletedAt'] = -1

        es.update(INDEX_DATASETS, '_doc', existingDataset_ES_ID, new_dataset, WAIT_FOR)

        # update domains
        domain = params['notArrayParams']['domain'].upper()

        isDomainNew = not(es.get_domain_by_name(domain))
        if isDomainNew:
            es.insert(INDEX_DOMAINS, '_doc', {"domainName": domain})

        # update tags
        tags = params['arrayParams']['tags']

        if not isDomainNew:
            for tag in tags:
                tagName = tag['value'].lower()
                tagName = tagName.capitalize()
                isTagNew = not(es.get_tag_of_domain(domain, tagName))

                if isTagNew:
                    es.insert(INDEX_TAGS, '_doc', {"domainName": domain, "tagName": tagName})
        else:
            for tag in tags:
                tagName = tag['value'].lower()
                tagName = tagName.capitalize()
                es.insert(INDEX_TAGS, '_doc', {"domainName": domain, "tagName": tagName})

        # ckan package update
        packageId = existing['ckan_package_id']
        updateDatasetToCkanInstance(packageId, new_dataset)

        return createResponse(HTTPStatus.OK, {'datasetId': dataset_id, 'packageId': packageId})

    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR, "UPDATE_DATASET_ERROR")


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
        es = getTransaction()

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]
        esId = dataset['_id']
        dataset = dataset['_source']

        # cleanup external
        dataset['downloadPath'] = ''

        # cleanup internal
        deleteCkanResourceIfNeeded(dataset)

        dataset['data_format'] = 'None'
        dataset['file_checksum'] = ''
        dataset['updates_number'] += 1
        dataset['lastUpdatedAt'] = str(int(time()))
        dataset['downloads_number'] = 0

        es.update(INDEX_DATASETS, '_doc', esId, dataset, WAIT_FOR)

        return createResponse(HTTPStatus.OK, "UPDATE_DATASET_FILES_SUCCESS")

    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR, "UPDATE_DATASET_FILES_ERROR")


def updateDatasetFilesToExternal(datasetId, downloadUrl):
    try:
        es = getTransaction()

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]
        esId = dataset['_id']
        dataset = dataset['_source']

        # setup external
        dataset['downloadPath'] = downloadUrl

        # cleanup internal
        deleteCkanResourceIfNeeded(dataset)

        dataset['data_format'] = 'None'
        dataset['file_checksum'] = ''
        dataset['updates_number'] += 1
        dataset['lastUpdatedAt'] = str(int(time()))
        dataset['downloads_number'] = 0

        es.update(INDEX_DATASETS, '_doc', esId, dataset, WAIT_FOR)

        return createResponse(HTTPStatus.OK, "UPDATE_DATASET_FILES_SUCCESS")

    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR, "UPDATE_DATASET_FILES_ERROR")


def deleteCkanResourceIfNeeded(dataset):
    if 'ckan_resource_id' in dataset and dataset['ckan_resource_id'] != '':
        ck.deleteResource(dataset['ckan_resource_id'])
        dataset['ckan_resource_id'] = ''

        print("Ckan resource has been deleted. datasetId={}".format(dataset['id']))
    else:
        print("No ckan resource to delete. datasetId={}".format(dataset['id']))


def updateDatasetFilesToInternal(datasetId, file):
    if not file or file.filename == '' or not(isFileAllowed(file)):
        return createResponse(HTTPStatus.BAD_REQUEST, "FILE_NOT_ALLOWED")

    if getFileSize(file) > UPLOAD_FILE_SIZE_MAX:
        return createResponse(HTTPStatus.BAD_REQUEST, "FILE_SIZE_EXCEEDED")

    try:
        es = getTransaction()

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
                'name': file.filename,
                'url': '{}/files'.format(datasetId)
            }

            resourceUrl = ck.updateResource(resource_data, file)
            dataset['downloadPath'] = resourceUrl
            dataset['data_format'] = getFileFormat(file)
            dataset['file_checksum'] = getFileChecksumChunks(file)
        else:
            # add resource
            packageId = dataset['ckan_package_id']

            resource_data = {
                'package_id': packageId,
                'name': file.filename,
                'url': '{}/files'.format(datasetId)
            }

            resourceId, resourceUrl = ck.addResource(resource_data, file)
            dataset['ckan_resource_id'] = resourceId
            dataset['downloadPath'] = resourceUrl
            dataset['data_format'] = getFileFormat(file)
            dataset['file_checksum'] = getFileChecksumChunks(file)

        dataset['updates_number'] += 1
        dataset['lastUpdatedAt'] = str(int(time()))
        dataset['downloads_number'] = 0

        es.update(INDEX_DATASETS, '_doc', esId, dataset, WAIT_FOR)

        return createResponse(HTTPStatus.OK, "UPDATE_DATASET_FILES_SUCCESS")

    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR, "UPDATE_DATASET_FILES_ERROR")


def increaseDownloadsNumber(dataset_id):
    try:
        es = getTransaction()

        es.update_dataset_downloads(int(dataset_id))

        return createResponse(HTTPStatus.OK, "INCREASE_DOWNLOADS_SUCCESS")

    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR, "INCREASE_DOWNLOADS_ERROR")
