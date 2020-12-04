# upload.py
import os
import sys
import pgdb
from datetime import datetime, timedelta
import es_connector
from time import sleep, time

def updateReviewByID(params):
    try:
        es = es_connector.ESClass(server='172.24.0.2', port=9200, use_ssl=False, user='', password='')
        es.connect()

        result = es.get_es_data_by_id('datasets', params['id'])

        datasets = []
        for dataset in result:
            datasets.append(dataset['_source'])
        
        if len(datasets) > 1:
            print("WARNING !! -> same id to more than 1 item")
        currentRatingValue = datasets[0]['avg_rating_value']
        currentNumberOfRatings = datasets[0]['ratings_number']

        newNumberOfRatings = currentNumberOfRatings + 1
        newRatingValue = (currentRatingValue * currentNumberOfRatings + params['rating']) / newNumberOfRatings

        # NU STIU SA FAC UPDATE (fara sa stric ceva)
        # es.update_dataset_rating('datasets', datasets[0]['id'], newRatingValue, newNumberOfRatings)


        newComment = {
            "datasetID": params['id'], 
            "username": params['username'], 
            "commentTitle": params['commentTitle'],
            "commentBody": params['commentBody'],
            "createdAt": str(time()),
            "rating": params['rating']}
        
        # es.insert('comments', '_doc', newComment)

        return "Succes"
    except:
        return "Eroare" 

def getCoordinates(country):
    es = es_connector.ESClass(server='172.24.0.2', port=9200, use_ssl=False, user='', password='')
    es.connect()

    locations = es.get_es_index('locations')[0]['_source']

    return ", ".join(str(x) for x in locations[country])

def uploadDataset(params, current_user):
    try:
        es = es_connector.ESClass(server='172.24.0.2', port=9200, use_ssl=False, user='', password='')
        es.connect()

        total = es.get_es_index('last_id')[0]['_source']['id']
        currentID = total + 1

        dataset_json = {}
        dataset_json_input = {}
        dataset_json_input['private'] = params['private']
        dataset_json_input['owner'] = current_user
        
        for k, v in params['notArrayParams'].items():
            dataset_json_input[k] = v
        dataset_json_input['views'] = '0'

        for k, v in params['arrayParams'].items():
            dataset_json_input[k] = v
        
        dataset_json_input['tags'] = list(map(lambda x: x['value'], dataset_json_input['tags']))
        
        dataset_json = dataset_json_input
        dataset_json['date'] = (datetime.now() - timedelta(hours = 3)).strftime('%Y-%m-%dT%H:%M:%S+0000')

        dataset_json['geo_coord'] = getCoordinates(params['notArrayParams']['country'])

        dataset_json['id'] = currentID

        dataset_json['lastUpdatedAt'] = str(int(time()))

        es.insert('datasets', '_doc', dataset_json)
        
        ### UPDATE LAST DATASET ID
        es.delete_index('last_id')
        sleep(2)
        es.insert('last_id', '_doc', {'id': currentID})

        ### UPDATE DOMAINS
        domain = params['notArrayParams']['domain'].upper()

        isDomainNew = not(es.get_es_data_by_domainName("domains", domain))
        if isDomainNew:
            es.insert('domains', '_doc', {"domainName": domain})
        
        ### UPDATE TAGS
        tags = params['arrayParams']['tags']

        if not(isDomainNew):
            for tag in tags:
                tagName = tag['value'].lower()
                tagName = tagName.capitalize()
                isTagNew = not(es.get_es_data_by_domainName_and_tagName("tags", domain, tagName))

                if isTagNew:
                    es.insert('tags', '_doc', {"domainName": domain, "tagName": tagName})
        else:
            for tag in tags:
                tagName = tag['value'].lower()
                tagName = tagName.capitalize()
                es.insert('tags', '_doc', {"domainName": domain, "tagName": tagName})
    
        return "Succes"
    except:
        return "Eroare" 

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
