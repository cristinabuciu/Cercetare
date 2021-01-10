# delete.py
import os
import sys
from flask import jsonify, json
import pgdb
import es_connector
import time
from operator import itemgetter

def deleteDataset(datasetId):
    try:
        es = es_connector.ESClass(server='172.23.0.2', port=9200, use_ssl=False, user='', password='')
        es.connect()

        es.delete_dataset_by_id('datasets', int(datasetId))
    
        return "Succes"
    except:
        return "Eroare"