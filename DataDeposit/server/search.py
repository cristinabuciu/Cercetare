# search.py
from application_properties import INDEX_USERS, INDEX_DATASETS, INDEX_DOMAINS, INDEX_LOCATIONS, INDEX_TAGS
from utils import getTransaction, calculateLastUpdatedAt, createResponse

from http import HTTPStatus
from operator import itemgetter

import re
import ckan_connector as ck


def getUserInfoById(userId):
    try:
        es = getTransaction()

        found = es.get_es_data_by_id(INDEX_USERS, userId)
        if not found:
            return createResponse(HTTPStatus.NOT_FOUND, "USER_NOT_FOUND")

        userInfo = found[0]['_source']

        privateDatasetNumber = es.count_datasets_by_ownerId(userId, True)
        publicDatasetNumber = es.count_datasets_by_ownerId(userId, False)

        response = {
            'username': userInfo['username'],
            'country': userInfo['country'],
            'email': userInfo['email'],
            'privDatasets': privateDatasetNumber,
            'pubDatasets': publicDatasetNumber,
            'hasPhoto': userInfo['hasPhoto']
        }
        return createResponse(HTTPStatus.OK, response)
    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR, "GET_USER_INFO_ERROR")


def getUserIdByName(username):
    es = getTransaction()

    found = es.get_user_by_name(username)
    if not found:
        return "0"
    else:
        return str(found[0]['_source']['id'])


def findUserID(username):
    try:
        userId = getUserIdByName(username)
        if userId == "0":
            return createResponse(HTTPStatus.NOT_FOUND, "USER_NOT_FOUND")
        else:
            return createResponse(HTTPStatus.OK, userId)
    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR, "GET_USER_ID_ERROR")


def searchDatasets(jsonParams):
    try:
        es = getTransaction()

        arrayParams = jsonParams['arrayParams']
        notArrayParams = jsonParams['notArrayParams']

        userId = None
        shouldDisplayPrivate = False
        if 'userId' in notArrayParams:
            userId = notArrayParams['userId']
            shouldDisplayPrivate = True

        result = es.get_filtered_datasets(notArrayParams['domain'], notArrayParams['country'], notArrayParams['data_format'], notArrayParams['year'], notArrayParams['dataset_title'],
                                          jsonParams['sortBy'], jsonParams['sortByField'], userId, shouldDisplayPrivate)

        # filter by tags
        if arrayParams['tags'] and len(arrayParams['tags']) > 0:
            result = list(filter(lambda dataset: filterByTags(dataset['_source'], arrayParams['tags'], 'tags'), result))

        # filter by authors
        if arrayParams['author'] and len(arrayParams['author']) > 0:
            result = list(filter(lambda dataset: filterByAuthors(dataset['_source'], arrayParams['author'], 'authors'), result))

        # filter by download type
        # TODO

        datasets = [dataset['_source'] for dataset in result]

        if jsonParams['count']:
            return createResponse(HTTPStatus.OK, len(datasets))
        else:
            lastDatasetIndex = int(jsonParams['currentPage']) * int(jsonParams['resultsPerPage'])
            firstDatasetIndex = lastDatasetIndex - int(jsonParams['resultsPerPage'])

            if lastDatasetIndex > len(datasets):
                lastDatasetIndex = len(datasets)

            return createResponse(HTTPStatus.OK, getPageResult(datasets, firstDatasetIndex, lastDatasetIndex))

    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR, "GET_DATASETS_ERROR")


def filterByTags(dataset, tags, datasetKey):
    for item in tags:
        if not(any(item['label'].lower() in word.lower() for word in dataset[datasetKey])):
            return False
    return True


def filterByAuthors(dataset, tags, datasetKey):
    for item in tags:
        if not(any(item.lower() in word.lower() for word in dataset[datasetKey])):
            return False
    return True


def getPageResult(datasets, start, end):
    return [toPageResult(dataset) for dataset in datasets[start:end]]


def toPageResult(dataset):
    resourceType, downloadPath = getResourceType(dataset)
    data_format = dataset['data_format'] if 'data_format' in dataset else ''

    return {
        'id': dataset['id'],
        'domain': dataset['domain'],
        'tags': dataset['tags'],
        'country': dataset['country'],
        'data_format': data_format,
        'authors': dataset['authors'],
        'year': dataset['year'],
        'dataset_title': dataset['dataset_title'],
        'article_title': dataset['article_title'],
        'short_desc': dataset['short_desc'],
        'avg_rating_value': dataset['avg_rating_value'],
        'gitlink': dataset['gitlink'],
        'resourceType': resourceType,
        'downloadPath': downloadPath,
        'owner': dataset['owner'],
        'private': dataset['private']
    }


def getResourceType(dataset):
    resourceType = 'NONE'
    downloadPath = ''

    if 'downloadPath' in dataset:
        downloadPath = dataset['downloadPath']

    if downloadPath == '':
        resourceType = 'NONE'
    else:
        matchResult = re.match(r'http://.+\:.+/dataset/.+/resource/.+/download/.+', downloadPath)
        if matchResult is None:
            resourceType = 'EXTERNAL'
        elif matchResult.group() == downloadPath:
            resourceType = 'INTERNAL'

    return resourceType, downloadPath


def findDataset(datasetId):
    try:
        es = getTransaction()

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]['_source']

        resourceType, downloadPath = getResourceType(dataset)
        dataset['resourceType'] = resourceType
        dataset['downloadPath'] = downloadPath
        dataset['elapsedTime'] = calculateLastUpdatedAt(int(dataset['lastUpdatedAt']))

        userInfo = es.get_es_data_by_id(INDEX_USERS, int(dataset['ownerId']))[0]['_source']
        dataset['hasPhoto'] = userInfo['hasPhoto'] if 'hasPhoto' in userInfo else False

        return createResponse(HTTPStatus.OK, dataset)
    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR, "GET_DATASET_ERROR")


def getDatasetFilesInfo(datasetId):
    try:
        es = getTransaction()

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]['_source']
        resourceType, downloadPath = getResourceType(dataset)

        result = None
        if resourceType == 'NONE':
            result = {'resourceType': resourceType}
        elif resourceType == 'EXTERNAL':
            result = {'resourceType': resourceType, 'downloadLink': downloadPath}
        elif resourceType == 'INTERNAL':
            resourceId = dataset['ckan_resource_id']
            fileName = ck.getResource(resourceId)['name']
            result = {'resourceType': resourceType, 'resourceId': resourceId, 'fileName': fileName}

        return createResponse(HTTPStatus.OK, result)
    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR, "GET_RESOURCE_INFO_ERROR")


def getAllComments(datasetId, currentPage, resultsPerPage):
    try:
        es = getTransaction()

        comments = [comment['_source'] for comment in es.get_dataset_comments(int(datasetId))]
        comments = list(filter(lambda comment: len(comment['commentBody']) > 0 and len(comment['commentTitle']) > 0, comments))
        comments = sorted(comments, key=itemgetter('createdAt'), reverse=True)

        lastCommentIndex = int(currentPage) * int(resultsPerPage)
        firstCommentIndex = lastCommentIndex - int(resultsPerPage)

        if lastCommentIndex > len(comments):
            lastCommentIndex = len(comments)

        pageResult = comments[firstCommentIndex:lastCommentIndex]

        return createResponse(HTTPStatus.OK, {'result': pageResult, 'total': len(comments)})
    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR, "GET_DATASET_COMMENTS_ERROR")


def getAllDefaultData():
    try:
        es = getTransaction()

        domains = [domain['_source']['domainName'] for domain in es.get_es_index(INDEX_DOMAINS)]
        countries = list(es.get_es_index(INDEX_LOCATIONS)[0]['_source'].keys())

        tags = {}
        for tag in es.get_es_index(INDEX_TAGS):
            if tag['_source']['domainName'] in tags:
                tags[tag['_source']['domainName']].append({"value": tag['_source']['tagName'], "label": tag['_source']['tagName']})
            else:
                tags[tag['_source']['domainName']] = [{"value": tag['_source']['tagName'], "label": tag['_source']['tagName']}]

        return createResponse(HTTPStatus.OK, [domains, tags, countries])
    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR, "GET_DEFAULT_DATA_ERROR")
