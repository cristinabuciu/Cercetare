# search.py
from application_properties import *

import re
from flask import jsonify, json
import es_connector
import ckan_connector as ck
import time
from operator import itemgetter

def getUserInfoById(userId):
    es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
    es.connect()

    userInfo = es.get_es_data_by_id(INDEX_USERS, userId)
    userInfo = userInfo[0]['_source']
    privateDatasetNumber = es.count_es_data_by_ownerId(INDEX_DATASETS, userId, True)
    publicDatasetNumber = es.count_es_data_by_ownerId(INDEX_DATASETS, userId, False)

    return json.dumps({'username': userInfo['username'], 'country': userInfo['country'], 'email': userInfo['email'], 'privDatasets': privateDatasetNumber, 'pubDatasets': publicDatasetNumber, 'hasPhoto': userInfo['hasPhoto']})

def filterByTags(dataset, tags, itemInDataset):
    for item in tags: 
        if not(any(item['label'].lower() in word.lower() for word in dataset[itemInDataset])):
            return False
    return True

def filterByAuthors(dataset, tags, itemInDataset):
    for item in tags: 
        if not(any(item.lower() in word.lower() for word in dataset[itemInDataset])):
            return False
    return True

def applyFilters(jsonParams):
    es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
    es.connect()
    
    userId = None
    shouldDisplayPrivate = False
    if 'userId' in jsonParams['notArrayParams']:
        userId = jsonParams['notArrayParams']['userId']
        shouldDisplayPrivate = True

    result = es.get_es_data(INDEX_DATASETS, jsonParams['notArrayParams']['domain'], jsonParams['notArrayParams']['country'], jsonParams['notArrayParams']['data_format'], jsonParams['notArrayParams']['year'], jsonParams['notArrayParams']['dataset_title'], jsonParams['sortBy'], jsonParams['sortByField'], userId, shouldDisplayPrivate)
    
    if jsonParams['arrayParams']['tags'] and len(jsonParams['arrayParams']['tags']) > 0:
        result = list(filter(lambda x: filterByTags(x['_source'], jsonParams['arrayParams']['tags'], 'tags'), result))
    
    if len(jsonParams['arrayParams']['author']) > 0:
        authorArray = jsonParams['arrayParams']['author'].split(", ")
        result = list(filter(lambda x: filterByAuthors(x['_source'], authorArray, 'authors'), result))
    
    # TODO: ADAUGA FILTRUL PENTRU DOWNLOAD TYPE
    
    datasets = []
    for dataset in result:
        datasets.append(dataset['_source'])
    if jsonParams['count'] == False:
        indexOfLastTodo = jsonParams['currentPage'] * jsonParams['resultsPerPage']
        indexOfFirstTodo = indexOfLastTodo - jsonParams['resultsPerPage']

        return completeSearch(datasets, indexOfFirstTodo, indexOfLastTodo)
    else:
        return json.dumps(len(datasets))
    

def completeSearch(datasets, lowLimit, upLimit):
    result = []
    item = lowLimit
    while item < upLimit and item < len(datasets):
        dataset = datasets[item]
        resourceType, downloadPath = getResourceType(dataset)

        aux = {
                'id': dataset['id'],
                'domain': dataset['domain'],
                'tags': dataset['tags'],
                'country': dataset['country'],
                'data_format': dataset['data_format'],
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

        result.append(aux)
        item += 1

    return json.dumps(result)


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


def calculateLastUpdatedAt(unixTime):
    
    currentTime = int(time.time())
    elapsedTime = currentTime - unixTime
    if elapsedTime < 60:
        return str(elapsedTime) + " seconds ago"
    elif elapsedTime < 60 * 60:
        return str(int(elapsedTime / 60)) + " minutes ago"
    elif elapsedTime < 24 * 60 * 60:
        return str(int(elapsedTime / (60 * 60))) + " hours ago"
    elif elapsedTime < 30 * 24 * 60 * 60:
        return str(int(elapsedTime / (24 * 60 * 60))) + " days ago"
    elif elapsedTime < 12 * 30 * 24 * 60 * 60:
        return str(int(elapsedTime / (30 * 24 * 60 * 60))) + " months ago"
    else:
        return str(int(elapsedTime / (12 * 30 * 24 * 60 * 60))) + " years ago"


def findDataset(datasetId):
    es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
    es.connect()

    result = es.get_es_data_by_id(INDEX_DATASETS, datasetId)
    returnArray = []
    datasets = []
    for dataset in result:
        datasets.append(dataset['_source'])
    
    if len(datasets) > 1:
        print("WARNING !! -> same id to more than 1 item")
    
    for dataset in datasets:
        elapsedTime = calculateLastUpdatedAt(int(dataset['lastUpdatedAt']))

        resourceType, downloadPath = getResourceType(dataset)
        
        result = es.get_es_data_by_id(INDEX_USERS, dataset['ownerId'])
        hasPhoto = False
        if result[0]['_source']:
            hasPhoto = result[0]['_source']['hasPhoto']

        dataset['elapsedTime'] = elapsedTime
        dataset['resourceType'] = resourceType
        dataset['downloadPath'] = downloadPath
        dataset['hasPhoto'] = hasPhoto

        returnArray.append(dataset)
    
    return json.dumps(returnArray)


def getAllDefaultData():
    es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
    es.connect()

    result = es.get_es_index(INDEX_DOMAINS)
    domains = []
    for domain in result:
        domains.append(domain['_source']['domainName'])
    
    result = es.get_es_index(INDEX_TAGS)
    tags = {}
    for tag in result:
        if tag['_source']['domainName'] in tags:
            tags[tag['_source']['domainName']].append({"value": tag['_source']['tagName'], "label": tag['_source']['tagName']})
        else:
            tags[tag['_source']['domainName']] = [{"value": tag['_source']['tagName'], "label": tag['_source']['tagName']}]
        
    result = es.get_es_index(INDEX_LOCATIONS)
    countries = list(result[0]['_source'].keys())

    return json.dumps([domains, tags, countries])


def findUserID(user):

    es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
    es.connect()

    found = es.get_es_data_by_userName(INDEX_USERS, user)
    if not(found):
        return "0"
    else:
        return str(found[0]['_source']['id'])

def getAllComments(datasetID, currentPage, resultsPerPage):
    es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
    es.connect()

    comments = es.get_es_data_by_datasetID(INDEX_COMMENTS, int(datasetID))

    returnArray = []
    allCommentsArray = []
    for comment in comments:
        if len(comment['_source']['commentBody']) > 0 and len(comment['_source']['commentTitle']) > 0:
            allCommentsArray.append(comment['_source'])
    
    allCommentsArray = sorted(allCommentsArray, key=itemgetter('createdAt'), reverse=True)

    indexOfLastTodo = int(currentPage) * int(resultsPerPage)
    indexOfFirstTodo = indexOfLastTodo - int(resultsPerPage)

    while indexOfFirstTodo < indexOfLastTodo and indexOfFirstTodo < len(allCommentsArray):
        returnArray.append(allCommentsArray[indexOfFirstTodo])
        indexOfFirstTodo += 1

    return json.dumps({"results": returnArray, "length": len(allCommentsArray)})


def getDatasetFilesInfo(datasetId):
    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]['_source']
        resourceType, downloadPath = getResourceType(dataset)

        if resourceType == 'NONE':
            return {'resourceType': resourceType}
        elif resourceType == 'EXTERNAL':
            return {'resourceType': resourceType, 'downloadLink': downloadPath}
        elif resourceType == 'INTERNAL':
            resourceId = dataset['ckan_resource_id']
            fileName = ck.getResource(resourceId)['name']
            return {'resourceType': resourceType, 'resourceId': resourceId, 'fileName': fileName}

    except Exception as e:
        print(e)
        return "GET_RESOURCE_INFO_ERROR"
