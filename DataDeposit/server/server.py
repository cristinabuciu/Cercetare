# server.py
from application_properties import *

import os
import subprocess
import sys
from search import applyFilters, findItem, getAllDefaultData, findUserID, getAllComments, getUserInfoById
from upload import uploadDataset, uploadPaths, updateReviewByID, updateNumberOfViews
from delete import deleteDataset, softDeleteDataset, deleteCommentById
import pgdb
import zipfile
from glob import glob
import es_connector
############################### FLASK CONFIG ################################
from flask import Flask, render_template, request, json, redirect, url_for, flash, session, make_response, jsonify
from werkzeug.utils import secure_filename
app = Flask(__name__, static_folder=FLASK_STATIC_FOLDER, template_folder=FLASK_TEMPLATE_FOLDER)

UPLOAD_FOLDER = UPLOAD_FOLDER_PATH
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 160 * 1024 * 1024
app.secret_key = FLASK_SECRET_KEY
ALLOWED_EXTENSIONS = {'rar', 'zip', 'tar.gz', 'jpg'}

current_user = 'admin'






# jinja typescript

# Butonul Upload -> poate mai mic?

# La upload avem 3 butoane pe o linie (Country, DOmain, Dataformat)
# Trebuie regandit sistemul de upload fisiere


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route("/")
def index():
    return render_template("index.html")
##############################################################################
def find_file(dir, ext):
    return glob(os.path.join(dir, "*.{}".format(ext)))

@app.route('/getUserId', methods = ['GET'])
def getUserId():
    return "Test"

@app.route("/logout_post", methods=['POST'])
def logout_post():
    session.clear()
    resp = make_response('Logout')
    resp.set_cookie('current_username', expires=0)
    return resp

@app.route('/getData', methods = ['POST', 'GET'])
def getData():
    receivedData = json.loads(request.data.decode('utf-8'))
    _items = receivedData.get('items')
    _params = receivedData.get('params')

    return applyFilters(_params)

@app.route('/getComments', methods = ['GET'])
def getComments():
    _datasetId = request.args['datasetId']
    _currentPage = request.args['currentPage']
    _resultsPerPage = request.args['resultsPerPage']

    return getAllComments(_datasetId, _currentPage, _resultsPerPage)

@app.route('/postData', methods = ['POST'])
def postData():
    global current_user
    receivedData = json.loads(request.data.decode('utf-8'))
    _params = receivedData.get('params')
    # return "Spune NU la upload!"
    return uploadDataset(_params, current_user)

@app.route('/updateReview', methods = ['POST'])
def updateReview():
    receivedData = json.loads(request.data.decode('utf-8'))
    _params = receivedData.get('params')

    return updateReviewByID(_params)

@app.route('/getItem', methods = ['GET'])
def getItem():
    _id = request.args['id']

    updateNumberOfViews(_id)

    return findItem(_id)

@app.route('/getUserID', methods = ['GET'])
def getUserID():
    _user = request.args['user']

    return findUserID(_user)

# Domain, Tags, Country
@app.route('/getDefaultData', methods = ['GET'])
def getDefaultData():
    return getAllDefaultData()

@app.route('/getUserInfo', methods = ['GET'])
def getUserInfo():
    _userID = request.args['userId']

    return getUserInfoById(_userID)

@app.route('/deleteDatasetById', methods = ['POST'])
def deleteDatasetById():
    receivedData = json.loads(request.data.decode('utf-8'))
    _params = receivedData.get('params')
    _id = _params['id']

    if SOFT_DELETE:
        return softDeleteDataset(_id)
    else:
        return deleteDataset(_id)

@app.route('/deleteComment', methods = ['POST'])
def deleteComment():
    receivedData = json.loads(request.data.decode('utf-8'))
    _params = receivedData.get('params')
    _id = _params['id']
    _commentRating = _params['commentRating']
    _datasetID = _params['datasetID']

    return deleteCommentById(_id, _commentRating, _datasetID)

@app.route("/login_post", methods=['POST'])
def login_post():
    receivedData = json.loads(request.data.decode('utf-8'))
    _username = receivedData.get('username')
    _password = receivedData.get('password')

    es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
    es.connect()
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


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploadFile', methods = ['POST'])
def upload_file():
    global current_user
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No file selected for uploading')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            # filename = secure_filename(file.filename)
            pathToFolder = (os.getcwd() + '/DataDeposit/server/' + app.config['UPLOAD_FOLDER'])
            pathToFolderInStaticPDF = (os.getcwd() + '/DataDeposit/static/dist/uploadPdfs/')
            pathToFolderInStaticZIP = (os.getcwd() + '/DataDeposit/static/dist/uploadDataset/')
            pathToFile = (os.path.join(pathToFolder, (current_user + '.zip')))
            file.save(pathToFile)
            # dezarhivare arhiva in folder cu numele user.ului
            print(os.path.join(pathToFolder, current_user))
            if not os.path.exists(os.path.join(pathToFolder, current_user)):
                os.makedirs(os.path.join(pathToFolder, current_user))

            with zipfile.ZipFile(pathToFile, 'r') as f:
                f.extractall(os.path.join(pathToFolder, current_user))

            pdfFileList = find_file(os.path.join(pathToFolder, current_user), 'pdf')
            pdfFile = pdfFileList[0]
            os.rename(pdfFile, (os.path.join(pathToFolder, current_user) + '/' + current_user + '.pdf'))
            pdfFile = os.path.join(pathToFolder, current_user) + '/' + current_user + '.pdf'
            os.system('cp ' + pdfFile + ' ' + pathToFolderInStaticPDF)
            ###############################
            zipFileList = find_file(os.path.join(pathToFolder, current_user), 'zip')
            zipFile = zipFileList[0]
            os.rename(zipFile, (os.path.join(pathToFolder, current_user) + '/' + current_user + '_dataset.zip'))
            zipFile = os.path.join(pathToFolder, current_user) + '/' + current_user + '_dataset.zip'
            os.system('cp ' + zipFile + ' ' + pathToFolderInStaticZIP)

            # in folder este un pdf si o arhiva cu setul de date

            # cand apesi pe titlu dataset din cautare sa iti afiseze pdf.ul pe o pagina noua

            # in info din BD trebuie adaugat calea catre pdf

            # incarc daca e public sau private

            flash('File successfully uploaded')
            return "Success"
        else:
            #flash('Allowed file types are txt, pdf, png, jpg, jpeg, gif')
            return 'Bad file'

if __name__ == "__main__":
    if CLEANUP_DATASETS_ENABLED:
        subprocess.Popen(['python3', 'DataDeposit/server/datasetsCleanupJob.py'])
    
    app.run(debug=True, use_reloader=False)

