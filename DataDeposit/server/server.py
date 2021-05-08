# server.py
from application_properties import FLASK_STATIC_FOLDER, FLASK_TEMPLATE_FOLDER, UPLOAD_FOLDER_PATH, FLASK_SECRET_KEY, INDEX_USERS, SOFT_DELETE, CLEANUP_DATASETS_ENABLED
from utils import getTransaction, createResponse

from search import searchDatasets, findDataset, getAllDefaultData, findUserID, getAllComments, getUserInfoById, getDatasetFilesInfo
from upload import uploadDataset, uploadDatasetFiles, addComment, updateNumberOfViews
from update import updateDataset, increaseDownloadsNumber, updateDatasetFilesToNone, updateDatasetFilesToExternal, updateDatasetFilesToInternal
from delete import hardDeleteDataset, softDeleteDataset, hardDeleteComment

############################### FLASK CONFIG ################################
from flask import Flask, render_template, request, json, redirect, url_for, flash, session, make_response, jsonify
from http import HTTPStatus

import subprocess

app = Flask(__name__, static_folder=FLASK_STATIC_FOLDER, template_folder=FLASK_TEMPLATE_FOLDER)

UPLOAD_FOLDER = UPLOAD_FOLDER_PATH
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 160 * 1024 * 1024
app.secret_key = FLASK_SECRET_KEY

current_user = 'admin'


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route("/")
def index():
    return render_template("index.html")


##############################################################################

@app.route("/login", methods=['POST'])
def login():
    global current_user
    receivedData = json.loads(request.data.decode('utf-8'))
    _username = receivedData.get('username')
    _password = receivedData.get('password')

    try:
        es = getTransaction()

        result = es.get_es_index(INDEX_USERS)
        isAuthenticated = False
        currentUser = ''
        currentUserId = 0
        errorMessage = ""

        for entry in result:
            if entry['_source']['username'] == _username and entry['_source']['password'] == _password:
                current_user = _username
                isAuthenticated = True
                session['login'] = True
                session['username'] = _username
                currentUser = _username
                currentUserId = entry['_source']['id']
                resp = make_response(jsonify(isAuthenticated=isAuthenticated, username=currentUser, userId=currentUserId, errorMessage=errorMessage))
                resp.set_cookie("current_username", _username)
                return resp

        errorMessage = "User-or-password-wrong"
        return make_response(jsonify(isAuthenticated=isAuthenticated, username=currentUser, userId=currentUserId, errorMessage=errorMessage))
    except Exception as e:
        print(e)
        return createResponse(HTTPStatus.INTERNAL_SERVER_ERROR, "LOGIN_ERROR")


@app.route("/logout", methods=['POST'])
def logout():
    session.clear()
    resp = make_response('Logout')
    resp.set_cookie('current_username', expires=0)
    return resp


@app.route('/datasets', methods=['GET'])
def getDatasets():
    _allFilters = json.loads(request.args['allFilters'])
    return searchDatasets(_allFilters)


@app.route('/dataset/<dataset_id>', methods=['GET'])
def getDataset(dataset_id):
    updateNumberOfViews(dataset_id)
    return findDataset(dataset_id)


@app.route('/datasets', methods=['POST'])
def addDataset():
    receivedData = json.loads(request.data.decode('utf-8'))
    _params = receivedData.get('params')

    return uploadDataset(_params, current_user)


@app.route('/dataset/<dataset_id>/files', methods=['POST'])
def addDatasetFiles(dataset_id):
    packageId = request.form['packageId']
    file = request.files['file'] if len(request.files) > 0 else None
    return uploadDatasetFiles(dataset_id, packageId, file)


@app.route('/dataset/<dataset_id>/files', methods=['GET'])
def getDatasetFiles(dataset_id):
    return getDatasetFilesInfo(dataset_id)


@app.route('/dataset/<dataset_id>', methods=['PUT'])
def editDataset(dataset_id):
    global current_user
    receivedData = json.loads(request.data.decode('utf-8'))
    _params = receivedData.get('params')
    return updateDataset(dataset_id, _params, current_user)


@app.route('/dataset/<dataset_id>/files', methods=['PUT'])
def editDatasetFiles(dataset_id):
    resourceType = request.form['newResourceType']
    if resourceType == 'NONE':
        return updateDatasetFilesToNone(dataset_id)
    elif resourceType == 'EXTERNAL':
        downloadUrl = request.form['downloadUrl']
        return updateDatasetFilesToExternal(dataset_id, downloadUrl)
    elif resourceType == 'INTERNAL':
        file = request.files['file']
        return updateDatasetFilesToInternal(dataset_id, file)


@app.route('/dataset/<dataset_id>', methods=['DELETE'])
def deleteDataset(dataset_id):
    if SOFT_DELETE:
        return softDeleteDataset(dataset_id)
    else:
        return hardDeleteDataset(dataset_id)


@app.route('/dataset/<dataset_id>/comments', methods=['GET'])
def getDatasetComments(dataset_id):
    _currentPage = request.args['currentPage']
    _resultsPerPage = request.args['resultsPerPage']

    return getAllComments(dataset_id, _currentPage, _resultsPerPage)


@app.route('/dataset/<dataset_id>/comments', methods=['POST'])
def addDatasetComment(dataset_id):
    receivedData = json.loads(request.data.decode('utf-8'))
    _comment = receivedData.get('comment')

    return addComment(dataset_id, _comment)


@app.route('/dataset/<dataset_id>/comment/<comment_id>', methods=['DELETE'])
def deleteComment(dataset_id, comment_id):
    return hardDeleteComment(dataset_id, comment_id)


@app.route('/dataset/<dataset_id>/downloads', methods=['PUT'])
def updateDatasetDownloads(dataset_id):
    return increaseDownloadsNumber(dataset_id)


@app.route('/user/<user_info>', methods=['GET'])
def getUserDetails(user_info):
    try:
        _user_id = int(user_info)
        return getUserInfoById(_user_id)
    except ValueError:
        _username = user_info
        return findUserID(_username)


# Domains, Tags, Country
@app.route('/getDefaultData', methods=['GET'])
def getDefaultData():
    return getAllDefaultData()


if __name__ == "__main__":
    if CLEANUP_DATASETS_ENABLED:
        subprocess.Popen(['python3', 'DataDeposit/server/datasetsCleanupJob.py'])
    
    app.run(debug=True, use_reloader=False, host='0.0.0.0', port=41338)

