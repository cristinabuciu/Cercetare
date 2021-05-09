from application_properties import DATABASE_IP, DATABASE_PORT, INDEX_LOCATIONS, UPLOAD_FILE_ALLOWED_MIME_TYPES
from os import SEEK_SET, SEEK_END

from time import time
from hashlib import md5

import es_connector
import magic


def getTransaction():
    es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
    es.connect()
    return es


def getCountryCoordinates(es, country):
    locations = es.get_es_index(INDEX_LOCATIONS)[0]['_source']
    return ", ".join(str(x) for x in locations[country])


def getFileMimeType(file):
    file.seek(0, SEEK_SET)
    return magic.Magic(mime=True).from_buffer(file.stream.read(2048))


def isFileAllowed(file):
    return getFileMimeType(file) in list(UPLOAD_FILE_ALLOWED_MIME_TYPES.keys())


def getFileFormat(file):
    return UPLOAD_FILE_ALLOWED_MIME_TYPES[getFileMimeType(file)]


def getFileChecksum(file):
    file.seek(0, SEEK_SET)
    return md5(file.read()).hexdigest()


def getFileChecksumChunks(file):
    file.seek(0, SEEK_SET)
    file_hash = md5()
    chunk = file.read(8192)
    while chunk:
        file_hash.update(chunk)
        chunk = file.read(8192)
    return file_hash.hexdigest()


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
