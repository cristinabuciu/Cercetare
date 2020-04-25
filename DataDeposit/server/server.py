# server.py
import os
import sys
############################### FLASK CONFIG ################################
from flask import Flask, render_template, request, json, redirect, url_for, flash
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

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)

