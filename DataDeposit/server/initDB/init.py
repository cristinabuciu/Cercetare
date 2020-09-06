import json
import os
from time import sleep
import es_connector
import pprint


locations = {}

#################### ADAUGARE LOCATII ##################
with open("locations_mapping/locations.json", 'r') as f:
    data = json.load(f)

    es = es_connector.ESClass(server='172.23.0.2', port=9200, use_ssl=False, user='', password='')
    es.connect()
    es.insert('locations', '_doc', data)

    sleep(5)
    pprint.pprint(es.get_es_index('locations'))
# #########################################################
sleep(5)
# #################### ADD BULK INSERT ####################
es = es_connector.ESClass(server='172.23.0.2', port=9200, use_ssl=False, user='', password='')
es.connect()

locations = es.get_es_index('locations')[0]['_source']

with open("bulk_input.json", 'r') as f:
    bulkData = json.load(f)
    for item in bulkData:
        item['geo_coord'] = ", ".join(str(x) for x in locations[item['country']])
        
        es.insert('datasets', '_doc', item)
# #########################################################
sleep(5)
# ################# CREATE LOGIN INDEX ##################

es = es_connector.ESClass(server='172.23.0.2', port=9200, use_ssl=False, user='', password='')
es.connect()

adminAccount = {'username': 'admin', 'password': 'admin'}
johnAccount = {'username': 'john', 'password': 'john'}
es.insert('logintable', '_doc', adminAccount)
es.insert('logintable', '_doc', johnAccount)
pprint.pprint(es.get_es_index('logintable'))

##########################################################
sleep(5)
#################### ADD BULK INSERT DIFERENT DATES ####################
es = es_connector.ESClass(server='172.23.0.2', port=9200, use_ssl=False, user='', password='')
es.connect()

locations = es.get_es_index('locations')[0]['_source']

with open("bulk_insert_date.json", 'r') as f:
    bulkData = json.load(f)
    for item in bulkData:
        item['geo_coord'] = ", ".join(str(x) for x in locations[item['country']])
        
        es.insert('datasets', '_doc', item)
#########################################################
sleep(5)
# ################# CREATE LAST ID INDEX ##################

es = es_connector.ESClass(server='172.23.0.2', port=9200, use_ssl=False, user='', password='')
es.connect()

es.insert('last_id', '_doc', {'id': 34})
sleep(2)
pprint.pprint(es.get_es_index('last_id')[0]['_source'])

# #########################################################