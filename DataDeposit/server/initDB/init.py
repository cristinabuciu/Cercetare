import json
import os
from time import sleep
import es_connector
import pprint


locations = {}
IP = '172.29.0.2'

#################### ADAUGARE LOCATII ##################
with open("locations_mapping/locations.json", 'r') as f:
    data = json.load(f)

    es = es_connector.ESClass(server=IP, port=9200, use_ssl=False, user='', password='')
    es.connect()
    es.insert('locations', '_doc', data)

    sleep(5)
    pprint.pprint(es.get_es_index('locations'))
# #########################################################
sleep(5)
# #################### ADD BULK INSERT ####################
es = es_connector.ESClass(server=IP, port=9200, use_ssl=False, user='', password='')
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

es = es_connector.ESClass(server=IP, port=9200, use_ssl=False, user='', password='')
es.connect()

adminAccount = {'id': 1, 'username': 'admin', 'password': 'admin', 'country': 'Romania', 'email': 'admin@admin.com', 'hasPhoto': True}
johnAccount = {'id': 2, 'username': 'john', 'password': '1234', 'country': 'Japan', 'email': 'john@john.com', 'hasPhoto': True}
dorianAccount = {'id': 3, 'username': 'Dorian', 'password': '1234', 'country': 'Germany', 'email': 'Dorian@Dorian.com', 'hasPhoto': False}
spAccount = {'id': 4, 'username': 'SpiderParker', 'password': '1234', 'country': 'Canada', 'email': 'SpiderParker@SpiderParker.com', 'hasPhoto': False}
putinAccount = {'id': 5, 'username': 'Putin', 'password': '1234', 'country': 'Russia', 'email': 'Putin@Putin.com', 'hasPhoto': False}
es.insert('logintable', '_doc', adminAccount)
es.insert('logintable', '_doc', johnAccount)
es.insert('logintable', '_doc', dorianAccount)
es.insert('logintable', '_doc', spAccount)
es.insert('logintable', '_doc', putinAccount)
pprint.pprint(es.get_es_index('logintable'))

##########################################################
sleep(5)
#################### ADD BULK INSERT DIFERENT DATES ####################
es = es_connector.ESClass(server=IP, port=9200, use_ssl=False, user='', password='')
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

es = es_connector.ESClass(server=IP, port=9200, use_ssl=False, user='', password='')
es.connect()

es.insert('id_generator', '_doc', {'datasets': 35, 'comments': 6})

sleep(2)
pprint.pprint(es.get_es_index('id_generator')[0]['_source'])

# #########################################################
sleep(5)
# ################# CREATE DOMAIN INDEX ###################

es = es_connector.ESClass(server=IP, port=9200, use_ssl=False, user='', password='')
es.connect()

with open("domains.json", 'r') as f:
    bulkData = json.load(f)
    for item in bulkData:
        es.insert('domains', '_doc', item)

sleep(2)

# #########################################################
sleep(5)
# ################## CREATE TAGS INDEX ####################

es = es_connector.ESClass(server=IP, port=9200, use_ssl=False, user='', password='')
es.connect()

with open("tags.json", 'r') as f:
    bulkData = json.load(f)
    for item in bulkData:
        es.insert('tags', '_doc', item)
sleep(2)

# #########################################################
sleep(5)
# ################ CREATE COMMENTS INDEX ##################

es = es_connector.ESClass(server=IP, port=9200, use_ssl=False, user='', password='')
es.connect()

with open("comms.json", 'r') as f:
    bulkData = json.load(f)
    for item in bulkData:
        es.insert('comments', '_doc', item)
sleep(2)

# #########################################################
