# server.py
import os
import sys
import mysql.connector
from search import search
############################### FLASK CONFIG ################################
from flask import Flask, render_template, request, json, redirect, url_for, flash, session, make_response, jsonify
app = Flask(__name__, static_folder="../static", template_folder="../static/dist")

UPLOAD_FOLDER = './uploadFiles'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 160 * 1024 * 1024
app.secret_key = 'development'

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

    return search(_items)

@app.route("/login_post", methods=['POST'])
def login_post():
    receivedData = json.loads(request.data.decode('utf-8'))
    _username = receivedData.get('username')
    _password = receivedData.get('password')
    cnx = mysql.connector.connect(user='root', password='secret', host='10.21.0.4', database='database')
    cursor = cnx.cursor()
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
            cnx.close()
            return resp

    cnx.close()
    errorMessage = "User-or-password-wrong"
    return make_response(jsonify(isAuthenticated=isAuthenticated, username=currentUser, errorMessage=errorMessage))

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)

