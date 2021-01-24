# delete.py
from application_properties import *
from time import time, sleep

import os
import sys
from flask import jsonify, json
import pgdb
import es_connector
from operator import itemgetter

def deleteCommentById(commentId, commentRating, datasetID):
    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        es.delete_comment_by_id(INDEX_COMMENTS, int(commentId))

        # recalculate dataset rating
        result = es.get_es_data_by_id(INDEX_DATASETS, datasetID)

        datasets = []
        for dataset in result:
            datasets.append(dataset['_source'])
        
        if len(datasets) > 1:
            print("WARNING !! -> same id to more than 1 item")

        currentRatingValue = datasets[0]['avg_rating_value']
        currentNumberOfRatings = datasets[0]['ratings_number']

        newNumberOfRatings = currentNumberOfRatings - 1
        newRatingValue = (currentRatingValue * currentNumberOfRatings - commentRating) / newNumberOfRatings

        es.update_dataset_rating(INDEX_DATASETS, datasets[0]['id'], round(newRatingValue, 2), newNumberOfRatings)
        sleep(1)

        return "Succes"
    except:
        return "Eroare"

def softDeleteDataset(datasetId):
    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        es.soft_delete_comments_by_dataset_id(INDEX_COMMENTS, int(datasetId), str(int(time())))
        es.soft_delete_dataset_by_id(INDEX_DATASETS, int(datasetId), int(time()))

        return "Succes"
    except:
        return "Eroare"

def deleteDataset(datasetId):
    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        es.delete_comments_by_dataset_id(INDEX_COMMENTS, int(datasetId))
        es.delete_dataset_by_id(INDEX_DATASETS, int(datasetId))
    
        return "Succes"
    except:
        return "Eroare"