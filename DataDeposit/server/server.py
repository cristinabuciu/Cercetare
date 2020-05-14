# server.py
import os
import sys
from search import search, applyFilters
import pgdb
############################### FLASK CONFIG ################################
from flask import Flask, render_template, request, json, redirect, url_for, flash, session, make_response, jsonify
app = Flask(__name__, static_folder="../static", template_folder="../static/dist")

UPLOAD_FOLDER = './uploadFiles'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 160 * 1024 * 1024
app.secret_key = 'development'

db_hostname = '10.21.0.4'
db_username = 'root'
db_password = 'secret'
db_database = 'database'

@app.route("/")
def index():
    return render_template("index.html")
##############################################################################

@app.route('/takeData', methods = ['GET'])
def upload_file():
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

@app.route("/login_post", methods=['POST'])
def login_post():
    global db_username, db_password, db_database, db_hostname
    receivedData = json.loads(request.data.decode('utf-8'))
    _username = receivedData.get('username')
    _password = receivedData.get('password')

    myConnection = pgdb.Connection( host=db_hostname, user=db_username, password=db_password, database=db_database )
    cursor = myConnection.cursor()
    
    cursor.execute("SELECT * from loginTable WHERE username = '%s'" % (_username))

    isAuthenticated = False
    currentUser = ''
    errorMessage = ""

    for (_, username, password)  in cursor:
        if _password == password: 
            isAuthenticated = True
            session['login'] = True
            session['username'] = username
            currentUser = username
            resp = make_response(jsonify(isAuthenticated=isAuthenticated, username=currentUser, errorMessage=errorMessage))
            resp.set_cookie("current_username", username)
            myConnection.close()
            return resp

    myConnection.close()
    errorMessage = "User-or-password-wrong"
    return make_response(jsonify(isAuthenticated=isAuthenticated, username=currentUser, errorMessage=errorMessage))

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)

