# upload.py
import os
import sys
import pgdb
from datetime import datetime, timedelta
import es_connector

locations = {
    'Romania' : (45.9432, 24.9668),
    'Japonia' : (83.777374, -620.587085),
    'SJ1' : (37.339365, -121.888105),
    'VA5' : (37.374802, -78.485903),
    'LON5' : (51.505861, -0.127066),
    'AMS1' : (52.367052, 4.888200),
    'SIN2' : (1.352437, 103.861423),
    'HK2' : (22.334770, 114.176440)
}

def uploadDataset(params, current_user):
    global locations
    try:
        es = es_connector.ESClass(server='172.24.0.2', port=9200, use_ssl=False, user='', password='')
        es.connect()

        total = len(es.get_es_index('datasets'))

        dataset_json = {}
        dataset_json_input = {}
        dataset_json_input['private'] = params['private']
        dataset_json_input['owner'] = current_user
        
        for k, v in params['notArrayParams'].items():
            dataset_json_input[k] = v
        
        for k, v in params['arrayParams'].items():
            dataset_json_input[k] = v
        
        dataset_json['input'] = dataset_json_input
        dataset_json['date'] = (datetime.now() - timedelta(hours = 3)).strftime('%Y-%m-%dT%H:%M:%S+0000')

        (latCoord, longCoord) = locations[params['notArrayParams']['country']]
        dataset_json['geo_coord'] = str(latCoord) + ', ' + str(longCoord)

        dataset_json['id'] = total + 1

        es.insert('datasets', '_doc', dataset_json)
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

# def uploadPaths(pathToPdf):
#     pass
