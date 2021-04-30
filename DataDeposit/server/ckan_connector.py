from application_properties import *

import requests
import json

actionPath = CKAN_INSTANCE_BASE_URL + '/action'
getPackageTarget = actionPath + '/package_show'
getGroupsTarget = actionPath + '/group_list'
createGroupTarget = actionPath + '/group_create'
createPackageTarget = actionPath + '/package_create'
createResourceTarget = actionPath + '/resource_create'
updatePackageTarget = actionPath + '/package_update'
updateResourceTarget = actionPath + '/resource_update'


def getGroups():
    existing = requests.get(getGroupsTarget)
    return json.loads(existing.content.decode('utf8').replace("'", '"'))['result']


def createGroupIfNeeded(group):
    existing = getGroups()

    if not(group in existing):
        requests.post(url=createGroupTarget,
                      headers={'Content-Type': 'application/json', 'Authorization': CKAN_INSTANCE_JWT},
                      data=json.dumps({'name': group}))


def addDatasetMetadata(datasetInfo):
    result = requests.post(url=createPackageTarget,
                           headers={'Content-Type': 'application/json', 'Authorization': CKAN_INSTANCE_JWT},
                           data=json.dumps(datasetInfo))

    packageId = json.loads(result.content.decode('utf8').replace("'", '"'))['result']['id']
    return packageId


def addDatasetFile(resourceInfo, file):
    result = requests.post(url=createResourceTarget,
                           headers={'Authorization': CKAN_INSTANCE_JWT},
                           data=resourceInfo,
                           files={'upload': file})

    resource = json.loads(result.content.decode('utf8').replace("'", '"'))['result']
    return resource['id'], resource['url']


def getPackage(packageId):
    existing = requests.get(getPackageTarget + '?id=' + packageId)
    return json.loads(existing.content.decode('utf8').replace("'", '"'))['result']


def updatePackage(packageId, packageData):
    result = requests.post(url=updatePackageTarget + '?id=' + packageId,
                           headers={'Content-Type': 'application/json', 'Authorization': CKAN_INSTANCE_JWT},
                           data=json.dumps(packageData))

    packageId = json.loads(result.content.decode('utf8').replace("'", '"'))['result']['id']
    return packageId


def updateResource(resourceData, file):
    result = requests.post(url=updateResourceTarget,
                           headers={'Authorization': CKAN_INSTANCE_JWT},
                           data=resourceData,
                           files={'upload': file})

    return json.loads(result.content.decode('utf8').replace("'", '"'))['result']['url']
