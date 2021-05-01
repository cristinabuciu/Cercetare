# delete.py
from application_properties import *
from time import time, sleep

import es_connector
import ckan_connector as ck


def hardDeleteComment(datasetId, commentId):
    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        result = es.get_es_data_by_id(INDEX_COMMENTS, int(commentId))
        commentRating = result[0]['_source']['rating']

        es.delete_comment_by_id(INDEX_COMMENTS, int(commentId))

        # recalculate dataset rating
        result = es.get_es_data_by_id(INDEX_DATASETS, int(datasetId))

        datasets = []
        for dataset in result:
            datasets.append(dataset['_source'])
        
        if len(datasets) > 1:
            print("WARNING !! -> same id to more than 1 item")

        currentRatingValue = datasets[0]['avg_rating_value']
        currentNumberOfRatings = datasets[0]['ratings_number']

        newNumberOfRatings = currentNumberOfRatings - 1
        newRatingValue = 0
        
        if newNumberOfRatings != 0:
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

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]['_source']
        if 'ckan_resource_id' in dataset and dataset['ckan_resource_id'] != '':
            deleteCkanData(datasetId, dataset['ckan_package_id'], dataset['ckan_resource_id'])
        else:
            deleteCkanData(datasetId, dataset['ckan_package_id'])

        es.soft_delete_comments_by_dataset_id(INDEX_COMMENTS, int(datasetId), str(int(time())))
        es.soft_delete_dataset_by_id(INDEX_DATASETS, int(datasetId), int(time()))

        return "Succes"
    except:
        return "Eroare"


def hardDeleteDataset(datasetId):
    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]['_source']
        if 'ckan_resource_id' in dataset and dataset['ckan_resource_id'] != '':
            deleteCkanData(datasetId, dataset['ckan_package_id'], dataset['ckan_resource_id'])
        else:
            deleteCkanData(datasetId, dataset['ckan_package_id'])

        es.delete_comments_by_dataset_id(INDEX_COMMENTS, int(datasetId))
        es.delete_dataset_by_id(INDEX_DATASETS, int(datasetId))
    
        return "Succes"
    except:
        return "Eroare"


def deleteCkanData(datasetId, packageId, resourceId=None):
    if resourceId is not None:
        print("Performing resource-delete for datasetId={}, resourceId={}".format(datasetId, resourceId))
        ck.deleteResource(resourceId)
        print("Finished resource-delete for datasetId={}, resourceId={}".format(datasetId, resourceId))

    print("Performing package-delete for datasetId={}, packageId={}".format(datasetId, packageId))
    ck.deletePackage(packageId)
    print("Finished package-delete for datasetId={}, packageId={}".format(datasetId, packageId))
