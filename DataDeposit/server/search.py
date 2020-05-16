# search.py
import os
import sys
from flask import jsonify, json
import pgdb

def search(numbersOfItemsPerPage):
    hostname = '10.21.0.4'
    username = 'root'
    password = 'secret'
    database = 'database'
    myConnection = pgdb.Connection( host=hostname, user=username, password=password, database=database )
    cursor = myConnection.cursor()
    
    cursor.execute("SELECT * from datasets")

    return jsonify(numbersOfItemsPerPage=numbersOfItemsPerPage)

def applyFilters(jsonParams):
    hostname = '10.21.0.4'
    username = 'root'
    password = 'secret'
    database = 'database'
    myConnection = pgdb.Connection( host=hostname, user=username, password=password, database=database )
    cursor = myConnection.cursor()

    jsonParams['arrayParams']['author'] = '%' if len(jsonParams['arrayParams']['author']) == 0 else jsonParams['arrayParams']['author'].replace(', ', '\', \'')

    query = "SELECT * from datasets WHERE "

    for (key, value) in jsonParams['notArrayParams'].items():
        query += key + ' LIKE \'' + value + '\' AND '

    for (key, value) in jsonParams['arrayParams'].items():
        if value == '%':
            continue
        query += key + ' @> ARRAY[\'' + value + '\'] AND '
    query = query[:-4]
    
    if jsonParams['sortBy'] == 'ASC':
         query += 'ORDER BY dataset_title ASC'
    elif jsonParams['sortBy'] == 'DESC':
         query += 'ORDER BY dataset_title DESC'
    
    cursor.execute(query)
    returnArray = []
    row = cursor.fetchone()
    if row == None:
        cursor.close()
        return json.dumps(returnArray)
    else:
        while row != None:
            returnArray.append([row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9]['demo_description'], row[9]['avg_rating_value']])
            row = cursor.fetchone()

    cursor.close()
    return json.dumps(returnArray)