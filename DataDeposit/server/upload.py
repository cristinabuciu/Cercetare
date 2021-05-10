# upload.py
from application_properties import INDEX_DATASETS, INDEX_ID_GENERATOR, INDEX_DOMAINS, INDEX_TAGS, INDEX_COMMENTS, CKAN_INSTANCE_ORG_ID, UPLOAD_FILE_SIZE_MAX
from utils import getCountryCoordinates, isFileAllowed, createResponse, getTransaction, getFileSize, getFileChecksumChunks, getFileFormat
from search import getUserIdByName
from constants import WAIT_FOR, SUCCESS, ERROR

from datetime import datetime, timedelta
from time import time
from http import HTTPStatus

import ckan_connector as ck


def uploadDataset(params, current_user):
    try:
        es = getTransaction()

        ownerID = int(getUserIdByName(current_user))
        currentDatasetID = es.get_es_index(INDEX_ID_GENERATOR)[0]['_source'][INDEX_DATASETS] + 1

        dataset_json = {
            'private': params['private'],
            'owner': current_user,
            'ownerId': ownerID
        }

        for k, v in params['notArrayParams'].items():
            dataset_json[k] = v

        for k, v in params['arrayParams'].items():
            dataset_json[k] = v
        
        dataset_json['tags'] = list(map(lambda x: x['value'], dataset_json['tags']))

        dataset_json['id'] = currentDatasetID
        dataset_json['updates_number'] = 0
        dataset_json['downloads_number'] = 0
        dataset_json['avg_rating_value'] = 0
        dataset_json['ratings_number'] = 0
        dataset_json['views'] = 0
        dataset_json['geo_coord'] = getCountryCoordinates(es, params['notArrayParams']['country'])
        dataset_json['date'] = (datetime.now() - timedelta(hours=3)).strftime('%Y-%m-%dT%H:%M:%S+0000')
        dataset_json['lastUpdatedAt'] = str(int(time()))
        dataset_json['data_format'] = "None"

        dataset_json['deleted'] = False
        dataset_json['deletedAt'] = -1

        es.insert(INDEX_DATASETS, '_doc', dataset_json, WAIT_FOR)
        es.update_id_generator(INDEX_DATASETS)

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

        # ckan package upload
        packageId = uploadDatasetToCkanInstance(dataset_json)

        # update dataset - add ckan packageId correlation
        existing = es.get_es_data_by_id(INDEX_DATASETS, dataset_json['id'])[0]
        esId = existing['_id']
        existing = existing['_source']
        existing['ckan_package_id'] = packageId
        es.update(INDEX_DATASETS, '_doc', esId, existing, WAIT_FOR)

        return createResponse(HTTPStatus.OK, {'datasetId': dataset_json['id'], 'packageId': packageId})
    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR, "UPLOAD_DATASET_ERROR")


def uploadDatasetToCkanInstance(dataset):
    group = dataset['domain'].replace(" ", "-").lower()
    ck.createGroupIfNeeded(group)

    ckanMetadata = {
        'title': dataset['dataset_title'],
        'name': str(dataset['id']),
        'private': dataset['private'],
        'author': ', '.join(dataset['authors']),
        'maintainer': dataset['owner'],
        'notes': dataset['short_desc'],
        'groups': [{'name': group}],
        'tags': list(map(lambda tag: {'name': tag}, dataset['tags'])),
        'owner_org': CKAN_INSTANCE_ORG_ID
    }

    if dataset['gitlink']:
        ckanMetadata['url'] = dataset['gitlink']

    # todo: add extras if needed (ckanMetadata['extras'] = [{'key': 'value'}]

    packageId = ck.addPackage(ckanMetadata)
    return packageId


def uploadDatasetFiles(datasetId, packageId, file):
    if not file or file.filename == '' or not(isFileAllowed(file)):
        return createResponse(HTTPStatus.BAD_REQUEST, "FILE_NOT_ALLOWED")

    if getFileSize(file) > UPLOAD_FILE_SIZE_MAX:
        return createResponse(HTTPStatus.BAD_REQUEST, "FILE_SIZE_EXCEEDED")

    try:
        es = getTransaction()

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]['_source']

        if dataset['ckan_package_id'] != packageId:
            return createResponse(HTTPStatus.BAD_REQUEST, "SKIP_UPLOAD_FILES_WRONG_PACKAGE_ID")

        # ckan resource upload
        resource_data = {
            'package_id': packageId,
            'name': file.filename,
            'url': '{}/files'.format(datasetId)
        }

        resourceId, resourceUrl = ck.addResource(resource_data, file)

        # update dataset - add ckan resourceId and url correlations
        existing = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]
        esId = existing['_id']
        existing = existing['_source']
        existing['ckan_resource_id'] = resourceId
        existing['downloadPath'] = resourceUrl
        existing['data_format'] = getFileFormat(file)
        existing['file_checksum'] = getFileChecksumChunks(file)
        es.update(INDEX_DATASETS, '_doc', esId, existing, WAIT_FOR)

        return createResponse(HTTPStatus.OK, {'datasetId': datasetId, 'packageId': packageId, 'resourceId': resourceId})

    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR, "UPLOAD_DATASET_FILES_ERROR")


def addComment(datasetId, comment):
    if comment['rating'] == 0:
        return createResponse(HTTPStatus.BAD_REQUEST, "ADD_DATASET_COMMENT_ERROR_MISSING_RATING")

    try:
        es = getTransaction()

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]['_source']

        currentRatingValue = dataset['avg_rating_value']
        currentNumberOfRatings = dataset['ratings_number']

        newNumberOfRatings = currentNumberOfRatings + 1
        newRatingValue = (currentRatingValue * currentNumberOfRatings + comment['rating']) / newNumberOfRatings

        es.update_dataset_rating(dataset['id'], round(newRatingValue, 2), newNumberOfRatings)

        currentCommentID = es.get_es_index(INDEX_ID_GENERATOR)[0]['_source'][INDEX_COMMENTS] + 1

        newComment = {
            "id": currentCommentID,
            "datasetID": datasetId,
            "username": comment['username'],
            "commentTitle": comment['commentTitle'],
            "commentBody": comment['commentBody'],
            "createdAt": str(time()),
            "rating": comment['rating']}

        es.insert(INDEX_COMMENTS, '_doc', newComment)
        es.update_id_generator(INDEX_COMMENTS)

        return createResponse(HTTPStatus.OK, "ADD_DATASET_COMMENT_SUCCESS")
    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR, "ADD_DATASET_COMMENT_ERROR")


def updateNumberOfViews(datasetId):
    try:
        es = getTransaction()
        es.update_dataset_views(int(datasetId))
        return SUCCESS
    except Exception as e:
        print(e)
        return ERROR
