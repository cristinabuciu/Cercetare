from application_properties import *
from os import SEEK_SET, SEEK_END

import es_connector


def getTransaction():
    es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
    es.connect()
    return es


def getCountryCoordinates(country):
    es = getTransaction()

    locations = es.get_es_index(INDEX_LOCATIONS)[0]['_source']

    return ", ".join(str(x) for x in locations[country])


def findUserID(username):
    es = getTransaction()

    found = es.get_es_data_by_userName(INDEX_USERS, username)
    if not found:
        return "0"
    else:
        return str(found[0]['_source']['id'])


def isFileAllowed(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in UPLOAD_FILE_ALLOWED_EXTENSIONS


def getFileSize(file):
    file.seek(0, SEEK_END)
    fileSize = file.tell()
    file.seek(0, SEEK_SET)
    return fileSize


def createResponse(statusCode, data):
    return {'statusCode': statusCode, 'data': data}
