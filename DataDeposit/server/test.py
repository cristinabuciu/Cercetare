from application_properties import *

import es_connector
import pprint



# es.insert('sergiu', '_doc', {'hatz':'hatz'})
# pprint.pprint(es.get_es_index(INDEX_DATASETS))

import json
import os
from time import sleep
locations = {}
# with open("locations_mapping/locations.json", 'r') as f:
#     data = json.load(f)
#     for location in data:
#         locations[location['name']] = (location['latlng'][0], location['latlng'][1])

# with open("locations_mapping/locationsParsed.json", 'w') as g:
#     json.dump(locations, g)

with open("locations_mapping/locations.json", 'r') as f:
    data = json.load(f)

    es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
    es.connect()
    es.insert(INDEX_LOCATIONS, '_doc', data)

    sleep(5)
    pprint.pprint(es.get_es_index(INDEX_LOCATIONS))


print("yeye")