# upload.py
from application_properties import *

import os
import sys
from datetime import datetime, timedelta
import es_connector
import ckan_connector as ck
from time import sleep, time

# TREBUIE FACUT FISIER CU FUNTII COMUNE
def findUserID(user):

    es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
    es.connect()

    found = es.get_es_data_by_userName(INDEX_USERS, user)
    if not(found):
        return "0"
    else:
        return str(found[0]['_source']['id'])


def updateNumberOfViews(id):
    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        es.update_dataset_views(INDEX_DATASETS, int(id))

        return "Succes"
    except:
        return "Eroare" 


def addComment(datasetId, comment):
    if comment['rating'] == 0:
        return "Skip"

    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        result = es.get_es_data_by_id(INDEX_DATASETS, datasetId)

        datasets = []
        for dataset in result:
            datasets.append(dataset['_source'])
        
        if len(datasets) > 1:
            print("WARNING !! -> same id to more than 1 item")
        currentRatingValue = datasets[0]['avg_rating_value']
        currentNumberOfRatings = datasets[0]['ratings_number']

        newNumberOfRatings = currentNumberOfRatings + 1
        newRatingValue = (currentRatingValue * currentNumberOfRatings + comment['rating']) / newNumberOfRatings

        es.update_dataset_rating(INDEX_DATASETS, datasets[0]['id'], round(newRatingValue, 2), newNumberOfRatings)

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
        es.update_id_generator(INDEX_ID_GENERATOR, INDEX_COMMENTS)

        return "Succes"
    except:
        return "Eroare" 


def getCoordinates(country):
    es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
    es.connect()

    locations = es.get_es_index(INDEX_LOCATIONS)[0]['_source']

    return ", ".join(str(x) for x in locations[country])


def uploadDataset(params, current_user):
    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        ownerID = findUserID(current_user)

        # lastDatasetID = es.count_es_data(INDEX_DATASETS)
        currentDatasetID = es.get_es_index(INDEX_ID_GENERATOR)[0]['_source'][INDEX_DATASETS] + 1

        dataset_json = {}
        dataset_json['private'] = params['private']
        dataset_json['owner'] = current_user
        dataset_json['ownerId'] = ownerID
        
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
        dataset_json['geo_coord'] = getCoordinates(params['notArrayParams']['country'])
        dataset_json['date'] = (datetime.now() - timedelta(hours = 3)).strftime('%Y-%m-%dT%H:%M:%S+0000')
        dataset_json['lastUpdatedAt'] = str(int(time()))

        dataset_json['deleted'] = False
        dataset_json['deletedAt'] = -1

        es.insert(INDEX_DATASETS, '_doc', dataset_json)
        es.update_id_generator(INDEX_ID_GENERATOR, INDEX_DATASETS)

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

        # ckan package upload
        packageId = uploadDatasetToCkanInstance(dataset_json)

        # update dataset - add ckan packageId correlation
        existing = es.get_es_data_by_id(INDEX_DATASETS, dataset_json['id'])[0]
        esId = existing['_id']
        existing = existing['_source']
        existing['ckan_package_id'] = packageId
        es.update(INDEX_DATASETS, '_doc', esId, existing)

        return {'datasetId': dataset_json['id'], 'packageId': packageId}
    except:
        return "UPLOAD_DATASET_ERROR"


def uploadDatasetToCkanInstance(dataset):
    group = dataset['domain'].replace(" ", "-").lower()
    ck.createGroupIfNeeded(group)

    ckanMetadata = {}

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

    # todo: add extras (ckanMetadata['extras'] = [{'key': 'value'}]

    packageId = ck.addDatasetMetadata(ckanMetadata)
    return packageId


def uploadDatasetFiles(datasetId, packageId, file):
    if not(file) or file.filename == '' or not(allowed_file(file.filename)):
        return "FILE_NOT_ALLOWED"

    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]['_source']

        if dataset['ckan_package_id'] != packageId:
            return "SKIP_UPLOAD_FILES_WRONG_PACKAGE_ID"

        # ckan resource upload
        filename = file.filename.split('.')[0]
        resource_data = {}
        resource_data['package_id'] = packageId
        resource_data['name'] = filename
        resource_data['url'] = '{}/files'.format(datasetId)

        resourceId = ck.addDatasetFile(resource_data, file)

        # update dataset - add ckan resourceId and url correlations
        existing = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]
        esId = existing['_id']
        existing = existing['_source']
        existing['ckan_resource_id'] = resourceId
        existing['downloadPath'] = CKAN_INSTANCE_DATASET_DOWNLOAD_URL.format(packageId, resourceId)
        es.update(INDEX_DATASETS, '_doc', esId, existing)

        return {'datasetId': datasetId, 'packageId': packageId, 'resourceId': resourceId}

    except Exception as e:
        print(e)
        return "UPLOAD_DATASET_FILES_ERROR"


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in UPLOAD_FILE_ALLOWED_EXTENSIONS


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

        new_dataset['deleted'] = False
        new_dataset['deletedAt'] = -1

        es.update(INDEX_DATASETS, '_doc', existingDataset_ES_ID, new_dataset)

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

        return "UPDATE_DATASET_SUCCESS"
    except:
        return "UPDATE_DATASET_ERROR"

    # def uploadDataset1(params, current_user):
#     hostname = '10.21.0.4'
#     username = 'root'
#     password = 'secret'
#     database = 'database'
#     myConnection = pgdb.Connection( host=hostname, user=username, password=password, database=database )
#     cursor = myConnection.cursor()

#     infoJson = {
#         'article_url': 'None',
#         'full_description': 'None',
#         'demo_description': params['notArrayParams']['short_desc'],
#         'GIT_url': params['notArrayParams']['gitlink'],
#         'avg_rating_value': 0.0,
#         'rating_commits': 0.0,
#         'owner': current_user
#     }
#     domain = params['notArrayParams']['domain']
#     country = params['notArrayParams']['country']
#     data_format = params['notArrayParams']['data_format']
#     year = params['notArrayParams']['year']
#     dataset_title = params['notArrayParams']['dataset_title']
#     article_title = params['notArrayParams']['article_title']

#     subdomain = ['"' + value + '"' for value in params['arrayParams']['subdomain']]
#     subdomainStr = '{' + ", ".join(subdomain) + '}'

#     authors = ['"' + value + '"' for value in params['arrayParams']['author']]
#     authorsStr = '{' + ", ".join(authors) + '}'

#     infoJsonStr = '{'
#     for (key, value) in infoJson.items():
#         if type(value) == float:
#             infoJsonStr += '"' + key + '": ' + str(value) + ', '
#         else:
#             infoJsonStr += '"' + key + '": "' + value + '", '
#     infoJsonStr = infoJsonStr[:-2]
#     infoJsonStr += '}'

#     query = 'INSERT INTO datasets(domain, subdomain, country, data_format, author, year, dataset_title, article_title, info) VALUES(\'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\');'.format(domain, subdomainStr, country, data_format, authorsStr, year, dataset_title, article_title, infoJsonStr)
#     query = query.replace('\\', '')
#     try:
#         cursor.execute(query)
#         cursor.close()
#         myConnection.commit()
#         return "Succes"
#     except:
#         cursor.close()
#         return "Eroare"


def uploadPaths(pathToPdf):
    pass
