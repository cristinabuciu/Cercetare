# upload.py
from application_properties import *

import os
import sys
from datetime import datetime, timedelta
import es_connector
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
    
        return "Succes"
    except:
        return "UPLOAD_DATASET_ERROR" 

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
