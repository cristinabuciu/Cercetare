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
    myConnection = pgdb.connect( host=hostname, user=username, password=password, database=database )
    cursor = myConnection.cursor()
    
    cursor.execute("SELECT * from datasets")

    return jsonify(numbersOfItemsPerPage=numbersOfItemsPerPage)

def applyFilters(jsonParams):
    hostname = '10.21.0.4'
    username = 'root'
    password = 'secret'
    database = 'database'
    myConnection = pgdb.connect( host=hostname, user=username, password=password, database=database )
    cursor = myConnection.cursor()

    query = "SELECT * from datasets WHERE "

    for (key, value) in jsonParams['notArrayParams'].items():
        query += key + ' LIKE \'' + value + '\' AND '
    query = query[:-4]
    for (key, value) in jsonParams['arrayParams'].items():
        if value == '%':
            continue
        query += key + ' @> ARRAY[' + value + '] '
    cursor.execute(query)

    if jsonParams['sortBy'] == 'ASC':
         query += 'SORT BY dataset_title ASC'
    elif jsonParams['sortBy'] == 'DESC':
         query += 'SORT BY dataset_title DESC'

    returnArray = []
    row = cursor.fetchone()
    if row == None:
        cursor.close()
        return json.dumps(returnArray)
    else:
        while row != None:
            returnArray.append([row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]])
            row = cursor.fetchone()

    cursor.close()
    return json.dumps(returnArray)