from application_properties import DATABASE_IP, DATABASE_PORT, INDEX_LOCATIONS, UPLOAD_FILE_ALLOWED_EXTENSIONS
from os import SEEK_SET, SEEK_END

from time import time

import es_connector


def getTransaction():
    es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
    es.connect()
    return es


def getCountryCoordinates(es, country):
    locations = es.get_es_index(INDEX_LOCATIONS)[0]['_source']
    return ", ".join(str(x) for x in locations[country])


def isFileAllowed(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in UPLOAD_FILE_ALLOWED_EXTENSIONS


def getFileSize(file):
    file.seek(0, SEEK_END)
    fileSize = file.tell()
    file.seek(0, SEEK_SET)
    return fileSize


def calculateLastUpdatedAt(unixTime):

    currentTime = int(time())
    elapsedTime = currentTime - unixTime
    if elapsedTime < 60:
        return str(elapsedTime) + " seconds ago"
    elif elapsedTime < 60 * 60:
        return str(int(elapsedTime / 60)) + " minutes ago"
    elif elapsedTime < 24 * 60 * 60:
        return str(int(elapsedTime / (60 * 60))) + " hours ago"
    elif elapsedTime < 30 * 24 * 60 * 60:
        return str(int(elapsedTime / (24 * 60 * 60))) + " days ago"
    elif elapsedTime < 12 * 30 * 24 * 60 * 60:
        return str(int(elapsedTime / (30 * 24 * 60 * 60))) + " months ago"
    else:
        return str(int(elapsedTime / (12 * 30 * 24 * 60 * 60))) + " years ago"


def createResponse(httpStatus, data):
    return {'statusCode': httpStatus.value, 'data': data}
