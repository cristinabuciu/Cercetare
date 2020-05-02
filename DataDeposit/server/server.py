# server.py
import os
import sys
import mysql.connector
############################### FLASK CONFIG ################################
from flask import Flask, render_template, request, json, redirect, url_for, flash, session, make_response
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
    return "HATZ JOHNULE"

@app.route("/login_post", methods=['POST'])
def login_post():
    receivedData = json.loads(request.data.decode('utf-8'))
    _username = receivedData.get('username')
    _password = receivedData.get('password')
    cnx = mysql.connector.connect(user='root', password='secret', host='10.21.0.4', database='database')
    cursor = cnx.cursor()
    cursor.execute("SELECT * from loginTable WHERE username = '%s'" % (_username))
   
    for (_, username, password)  in cursor:
        if _password == password: 
            session['login'] = True
            session['username'] = username
            resp = make_response("Cookies")
            resp.set_cookie("login_s", username)
            cnx.close()
            return resp

    cnx.close()
    return "User-or-password-wrong"

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)

