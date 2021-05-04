# upload.py
from application_properties import *

from os import SEEK_SET, SEEK_END
import sys
from datetime import datetime, timedelta
import es_connector
import ckan_connector as ck
from time import sleep, time

# TREBUIE FACUT FISIER CU FUNTII COMUNE
def findUserID(user):

    es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
    es.connect()

    found = es.get_es_data_by_userName(INDEX_USERS, user)
    if not(found):
        return "0"
    else:
        return str(found[0]['_source']['id'])


def updateNumberOfViews(id):
    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        es.update_dataset_views(INDEX_DATASETS, int(id))

        return "Succes"
    except:
        return "Eroare" 


def addComment(datasetId, comment):
    if comment['rating'] == 0:
        return "Skip"

    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        result = es.get_es_data_by_id(INDEX_DATASETS, datasetId)

        datasets = []
        for dataset in result:
            datasets.append(dataset['_source'])
        
        if len(datasets) > 1:
            print("WARNING !! -> same id to more than 1 item")
        currentRatingValue = datasets[0]['avg_rating_value']
        currentNumberOfRatings = datasets[0]['ratings_number']

        newNumberOfRatings = currentNumberOfRatings + 1
        newRatingValue = (currentRatingValue * currentNumberOfRatings + comment['rating']) / newNumberOfRatings

        es.update_dataset_rating(INDEX_DATASETS, datasets[0]['id'], round(newRatingValue, 2), newNumberOfRatings)

        currentCommentID = es.get_es_index(INDEX_ID_GENERATOR)[0]['_source'][INDEX_COMMENTS] + 1

        newComment = {
            "id": currentCommentID,
            "datasetID": datasetId,
            "username": comment['username'],
            "commentTitle": comment['commentTitle'],
            "commentBody": comment['commentBody'],
            "createdAt": str(time()),
            "rating": comment['rating']}
        
        es.insert(INDEX_COMMENTS, '_doc', newComment)
        es.update_id_generator(INDEX_ID_GENERATOR, INDEX_COMMENTS)

        return "Succes"
    except:
        return "Eroare" 


def getCoordinates(country):
    es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
    es.connect()

    locations = es.get_es_index(INDEX_LOCATIONS)[0]['_source']

    return ", ".join(str(x) for x in locations[country])


def uploadDataset(params, current_user):
    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        ownerID = int(findUserID(current_user))

        # lastDatasetID = es.count_es_data(INDEX_DATASETS)
        currentDatasetID = es.get_es_index(INDEX_ID_GENERATOR)[0]['_source'][INDEX_DATASETS] + 1

        dataset_json = {}
        dataset_json['private'] = params['private']
        dataset_json['owner'] = current_user
        dataset_json['ownerId'] = ownerID
        
        for k, v in params['notArrayParams'].items():
            dataset_json[k] = v

        for k, v in params['arrayParams'].items():
            dataset_json[k] = v
        
        dataset_json['tags'] = list(map(lambda x: x['value'], dataset_json['tags']))

        dataset_json['id'] = currentDatasetID
        dataset_json['updates_number'] = 0
        dataset_json['downloads_number'] = 0
        dataset_json['avg_rating_value'] = 0
        dataset_json['ratings_number'] = 0
        dataset_json['views'] = 0
        dataset_json['geo_coord'] = getCoordinates(params['notArrayParams']['country'])
        dataset_json['date'] = (datetime.now() - timedelta(hours = 3)).strftime('%Y-%m-%dT%H:%M:%S+0000')
        dataset_json['lastUpdatedAt'] = str(int(time()))

        dataset_json['deleted'] = False
        dataset_json['deletedAt'] = -1

        es.insert(INDEX_DATASETS, '_doc', dataset_json, WAIT_FOR)
        es.update_id_generator(INDEX_ID_GENERATOR, INDEX_DATASETS)

        ### UPDATE DOMAINS
        domain = params['notArrayParams']['domain'].upper()

        isDomainNew = not(es.get_es_data_by_domainName(INDEX_DOMAINS, domain))
        if isDomainNew:
            es.insert(INDEX_DOMAINS, '_doc', {"domainName": domain})
        
        ### UPDATE TAGS
        tags = params['arrayParams']['tags']

        if not(isDomainNew):
            for tag in tags:
                tagName = tag['value'].lower()
                tagName = tagName.capitalize()
                isTagNew = not(es.get_es_data_by_domainName_and_tagName(INDEX_TAGS, domain, tagName))

                if isTagNew:
                    es.insert(INDEX_TAGS, '_doc', {"domainName": domain, "tagName": tagName})
        else:
            for tag in tags:
                tagName = tag['value'].lower()
                tagName = tagName.capitalize()
                es.insert(INDEX_TAGS, '_doc', {"domainName": domain, "tagName": tagName})

        # ckan package upload
        packageId = uploadDatasetToCkanInstance(dataset_json)

        # update dataset - add ckan packageId correlation
        existing = es.get_es_data_by_id(INDEX_DATASETS, dataset_json['id'])[0]
        esId = existing['_id']
        existing = existing['_source']
        existing['ckan_package_id'] = packageId
        es.update(INDEX_DATASETS, '_doc', esId, existing, WAIT_FOR)

        return {'datasetId': dataset_json['id'], 'packageId': packageId}
    except Exception as e:
        print(e)
        return "UPLOAD_DATASET_ERROR"


def uploadDatasetToCkanInstance(dataset):
    group = dataset['domain'].replace(" ", "-").lower()
    ck.createGroupIfNeeded(group)

    ckanMetadata = {}

    ckanMetadata['title'] = dataset['dataset_title']
    ckanMetadata['name'] = str(dataset['id'])
    ckanMetadata['private'] = dataset['private']
    ckanMetadata['author'] = ', '.join(dataset['authors'])
    ckanMetadata['maintainer'] = dataset['owner']
    ckanMetadata['notes'] = dataset['short_desc']
    ckanMetadata['groups'] = [{'name': group}]
    ckanMetadata['tags'] = list(map(lambda tag: {'name': tag}, dataset['tags']))
    ckanMetadata['owner_org'] = CKAN_INSTANCE_ORG_ID

    if dataset['gitlink']:
        ckanMetadata['url'] = dataset['gitlink']

    # todo: add extras if needed (ckanMetadata['extras'] = [{'key': 'value'}]

    packageId = ck.addPackage(ckanMetadata)
    return packageId


def uploadDatasetFiles(datasetId, packageId, file):
    if not(file) or file.filename == '' or not(allowed_file(file.filename)):
        return "FILE_NOT_ALLOWED"

    file.seek(0, SEEK_END)
    fileSize = file.tell()
    file.seek(0, SEEK_SET)

    if fileSize > UPLOAD_FILE_SIZE_MAX:
        return "FILE_SIZE_EXCEEDED"

    try:
        es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
        es.connect()

        dataset = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]['_source']

        if dataset['ckan_package_id'] != packageId:
            return "SKIP_UPLOAD_FILES_WRONG_PACKAGE_ID"

        # ckan resource upload
        filename = file.filename.split('.')[0]
        resource_data = {}
        resource_data['package_id'] = packageId
        resource_data['name'] = filename
        resource_data['url'] = '{}/files'.format(datasetId)

        resourceId, resourceUrl = ck.addResource(resource_data, file)

        # update dataset - add ckan resourceId and url correlations
        existing = es.get_es_data_by_id(INDEX_DATASETS, datasetId)[0]
        esId = existing['_id']
        existing = existing['_source']
        existing['ckan_resource_id'] = resourceId
        existing['downloadPath'] = resourceUrl
        es.update(INDEX_DATASETS, '_doc', esId, existing, WAIT_FOR)

        return {'datasetId': datasetId, 'packageId': packageId, 'resourceId': resourceId}

    except Exception as e:
        print(e)
        return "UPLOAD_DATASET_FILES_ERROR"


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in UPLOAD_FILE_ALLOWED_EXTENSIONS

