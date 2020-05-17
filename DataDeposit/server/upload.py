# upload.py
import os
import sys
import pgdb

def uploadDataset(params, current_user):
    hostname = '10.21.0.4'
    username = 'root'
    password = 'secret'
    database = 'database'
    myConnection = pgdb.Connection( host=hostname, user=username, password=password, database=database )
    cursor = myConnection.cursor()

    infoJson = {
        'article_url': 'None',
        'full_description': 'None',
        'demo_description': params['notArrayParams']['short_desc'],
        'GIT_url': params['notArrayParams']['gitlink'],
        'avg_rating_value': 0.0,
        'rating_commits': 0.0,
        'owner': current_user
    }
    domain = params['notArrayParams']['domain']
    country = params['notArrayParams']['country']
    data_format = params['notArrayParams']['data_format']
    year = params['notArrayParams']['year']
    dataset_title = params['notArrayParams']['dataset_title']
    article_title = params['notArrayParams']['article_title']

    subdomain = ['"' + value + '"' for value in params['arrayParams']['subdomain']]
    subdomainStr = '{' + ", ".join(subdomain) + '}'

    authors = ['"' + value + '"' for value in params['arrayParams']['author']]
    authorsStr = '{' + ", ".join(authors) + '}'

    infoJsonStr = '{'
    for (key, value) in infoJson.items():
        if type(value) == float:
            infoJsonStr += '"' + key + '": ' + str(value) + ', '
        else:
            infoJsonStr += '"' + key + '": "' + value + '", '
    infoJsonStr = infoJsonStr[:-2]
    infoJsonStr += '}'

    query = 'INSERT INTO datasets(domain, subdomain, country, data_format, author, year, dataset_title, article_title, info) VALUES(\'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\');'.format(domain, subdomainStr, country, data_format, authorsStr, year, dataset_title, article_title, infoJsonStr)
    query = query.replace('\\', '')
    try:
        cursor.execute(query)
        cursor.close()
        myConnection.commit()
        return "Succes"
    except:
        cursor.close()
        return "Eroare"

def uploadPaths(pathToPdf):
    pass
