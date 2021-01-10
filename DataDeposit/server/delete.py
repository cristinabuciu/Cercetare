# delete.py
from application_properties import *

import os
import sys
from flask import jsonify, json
import pgdb
import es_connector
import time
from operator import itemgetter

def deleteDataset(datasetId):
    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        es.delete_dataset_by_id(INDEX_DATASETS, int(datasetId))
    
        return "Succes"
    except:
        return "Eroare"