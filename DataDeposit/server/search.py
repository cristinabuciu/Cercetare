# search.py
import os
import sys
from flask import jsonify, json
import pgdb
import es_connector


def search(numbersOfItemsPerPage):
    hostname = '10.21.0.4'
    username = 'root'
    password = 'secret'
    database = 'database'
    myConnection = pgdb.Connection( host=hostname, user=username, password=password, database=database )
    cursor = myConnection.cursor()
    
    cursor.execute("SELECT * from datasets")

    return jsonify(numbersOfItemsPerPage=numbersOfItemsPerPage)

def filterByArray(dataset, subdomains, itemInDataset):
    for item in subdomains: 
        if not(any(item.lower() in word.lower() for word in dataset[itemInDataset])):
            return False
    return True

def applyFilters(jsonParams):
    es = es_connector.ESClass(server='172.23.0.2', port=9200, use_ssl=False, user='', password='')
    es.connect()
    
    result = es.get_es_data('datasets', jsonParams['notArrayParams']['domain'], jsonParams['notArrayParams']['country'], jsonParams['notArrayParams']['data_format'], jsonParams['notArrayParams']['year'], jsonParams['notArrayParams']['dataset_title'], jsonParams['sortBy'], jsonParams['sortByField'])
    
    if len(jsonParams['arrayParams']['subdomain']) > 0:
        subdomainArray = jsonParams['arrayParams']['subdomain'].split(", ")
        result = list(filter(lambda x: filterByArray(x['_source'], subdomainArray, 'subdomain'), result))
    
    if len(jsonParams['arrayParams']['author']) > 0:
        authorArray = jsonParams['arrayParams']['author'].split(", ")
        result = list(filter(lambda x: filterByArray(x['_source'], authorArray, 'authors'), result))

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
    returnArray = []
    # for row in datasets:
    item = lowLimit
    while item < upLimit and item < len(datasets):
        row = datasets[item]
        hasDownloadLink = 2
        downloadPath = ''
        if 'downloadPath' in row:
            if row['downloadPath'].startswith('link'):
                hasDownloadLink = 1
                downloadPath = row['downloadPath'][5:]
            elif row['downloadPath'].startswith('private'):
                hasDownloadLink = 2
            elif row['downloadPath'].startswith('path'):
                hasDownloadLink = 3
                downloadPath = row['downloadPath'][5:]

        returnArray.append([row['id'], row['domain'], row['subdomain'], row['country'], row['data_format'], row['authors'], row['year'], row['dataset_title'], row['article_title'], row['short_desc'], row['avg_rating_value'], row['gitlink'], hasDownloadLink, downloadPath, row['owner'], row['private']])
        item += 1

    return json.dumps(returnArray)

def findItem(id):
    es = es_connector.ESClass(server='172.23.0.2', port=9200, use_ssl=False, user='', password='')
    es.connect()

    result = es.get_es_data_by_id('datasets', id)
    returnArray = []
    datasets = []
    for dataset in result:
        datasets.append(dataset['_source'])
    
    if len(datasets) > 1:
        print("WARNING !! -> same id to more than 1 item")
    
    for row in datasets:
        returnArray.append([row['id'], row['domain'], row['subdomain'], row['country'], row['data_format'], row['authors'], row['year'], row['dataset_title'], row['article_title'], row['short_desc'], row['avg_rating_value'], row['gitlink']])
    
    return json.dumps(returnArray)





# def applyFilters1(jsonParams):
#     hostname = '10.21.0.4'
#     username = 'root'
#     password = 'secret'
#     database = 'database'

#     # es = es_connector.ESClass(server='https://kibana-api.ne.adobe.net', port=443, use_ssl=True, user='', password='')
#     # es.connect()


#     myConnection = pgdb.Connection( host=hostname, user=username, password=password, database=database )
#     cursor = myConnection.cursor()

#     jsonParams['arrayParams']['author'] = '%' if len(jsonParams['arrayParams']['author']) == 0 else jsonParams['arrayParams']['author'].replace(', ', '\', \'')

#     query = "SELECT * from datasets WHERE "

#     for (key, value) in jsonParams['notArrayParams'].items():
#         query += key + ' LIKE \'' + value + '\' AND '

#     for (key, value) in jsonParams['arrayParams'].items():
#         if value == '%':
#             continue
#         query += key + ' @> ARRAY[\'' + value + '\'] AND '
#     query = query[:-4]
    
#     if jsonParams['sortBy'] == 'ASC':
#          query += 'ORDER BY dataset_title ASC'
#     elif jsonParams['sortBy'] == 'DESC':
#          query += 'ORDER BY dataset_title DESC'
    
#     cursor.execute(query)
#     returnArray = []
#     row = cursor.fetchone()
#     if row == None:
#         cursor.close()
#         return json.dumps(returnArray)
#     else:
#         while row != None:
#             returnArray.append([row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9]['demo_description'], row[9]['avg_rating_value']])
#             row = cursor.fetchone()

#     cursor.close()
#     return json.dumps(returnArray)