import es_connector
import pprint


# es = es_connector.ESClass(server='172.22.0.2', port=9200, use_ssl=False, user='', password='')
# es.connect()

# es.insert('sergiu', '_doc', {'hatz':'hatz'})
# pprint.pprint(es.get_es_index('datasets'))

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

    es = es_connector.ESClass(server='172.23.0.2', port=9200, use_ssl=False, user='', password='')
    es.connect()
    es.insert('locations', '_doc', data)

    sleep(5)
    pprint.pprint(es.get_es_index('locations'))


print("yeye")