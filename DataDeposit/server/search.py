# search.py
import os
import sys
from flask import jsonify

def search(numbersOfItemsPerPage):
    return jsonify(numbersOfItemsPerPage=numbersOfItemsPerPage)