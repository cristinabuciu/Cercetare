# delete.py
from application_properties import INDEX_DATASETS, INDEX_COMMENTS
from utils import getTransaction, createResponse
from time import time, sleep
from http import HTTPStatus

import ckan_connector as ck


def softDeleteDataset(datasetId):
    try:
        es = getTransaction()

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]['_source']
        if 'ckan_resource_id' in dataset and dataset['ckan_resource_id'] != '':
            deleteCkanData(datasetId, dataset['ckan_package_id'], dataset['ckan_resource_id'])
        else:
            deleteCkanData(datasetId, dataset['ckan_package_id'])

        es.soft_delete_comments_by_dataset_id(INDEX_COMMENTS, int(datasetId), str(int(time())))
        es.soft_delete_dataset_by_id(INDEX_DATASETS, int(datasetId), int(time()))

        return createResponse(HTTPStatus.OK.value, "DELETE_DATASET_SUCCESS")
    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR.value, "DELETE_DATASET_ERROR")


def hardDeleteDataset(datasetId):
    try:
        es = getTransaction()

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]['_source']
        if 'ckan_resource_id' in dataset and dataset['ckan_resource_id'] != '':
            deleteCkanData(datasetId, dataset['ckan_package_id'], dataset['ckan_resource_id'])
        else:
            deleteCkanData(datasetId, dataset['ckan_package_id'])

        es.delete_comments_by_dataset_id(INDEX_COMMENTS, int(datasetId))
        es.delete_dataset_by_id(INDEX_DATASETS, int(datasetId))

        return createResponse(HTTPStatus.OK.value, "DELETE_DATASET_SUCCESS")
    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR.value, "DELETE_DATASET_ERROR")


def deleteCkanData(datasetId, packageId, resourceId=None):
    if resourceId is not None:
        print("Performing resource-delete for datasetId={}, resourceId={}".format(datasetId, resourceId))
        ck.deleteResource(resourceId)
        print("Finished resource-delete for datasetId={}, resourceId={}".format(datasetId, resourceId))

    print("Performing package-delete for datasetId={}, packageId={}".format(datasetId, packageId))
    ck.deletePackage(packageId)
    print("Finished package-delete for datasetId={}, packageId={}".format(datasetId, packageId))


def hardDeleteComment(datasetId, commentId):
    try:
        es = getTransaction()

        comment = es.get_es_data_by_id(INDEX_COMMENTS, int(commentId))[0]['_source']
        commentRating = comment['rating']

        es.delete_comment_by_id(INDEX_COMMENTS, int(commentId))

        # recalculate dataset rating
        dataset = es.get_es_data_by_id(INDEX_DATASETS, int(datasetId))[0]['_source']

        currentRatingValue = dataset['avg_rating_value']
        currentNumberOfRatings = dataset['ratings_number']

        newNumberOfRatings = currentNumberOfRatings - 1
        newRatingValue = 0

        if newNumberOfRatings != 0:
            newRatingValue = (currentRatingValue * currentNumberOfRatings - commentRating) / newNumberOfRatings

        es.update_dataset_rating(INDEX_DATASETS, dataset['id'], round(newRatingValue, 2), newNumberOfRatings)
        sleep(1)

        return createResponse(HTTPStatus.OK.value, "DELETE_DATASET_COMMENT_SUCCESS")
    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR.value, "DELETE_DATASET_COMMENT_ERROR")
