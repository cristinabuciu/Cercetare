import requests
import json

# GET GROUPS
a = requests.get('http://0.0.0.0:5000/api/action/group_list')
print(json.loads(a.content.decode('utf8').replace("'", '"'))['result'])

# GET ORGANIZATIONS
b = requests.get('http://0.0.0.0:5000/api/action/organization_list')
print(json.loads(b.content.decode('utf8').replace("'", '"'))['result'])

# GET PACKAGES (dataset metadata)
b = requests.get('http://0.0.0.0:5000/api/action/package_list')
print(json.loads(b.content.decode('utf8').replace("'", '"'))['result'])


# GET RESOURCE
# b = requests.get('http://0.0.0.0:5000/api/action/current_package_list_with_resources')
# pprint.pprint(json.loads(b.content.decode('utf8').replace("'", '"'))['result'])


# INSERT DATASET METADATA
metadata_dict = {'name': 'my_dataset5', 'private': False, 'author': 'John', 'author_email': 'a@a.com', 'maintainer': 'Alex', 'maintainer_email': 'alex@a.com', 'notes': 'ajsfiosdhifujsd',
'groups': [{'name': 'it'}],
'tags': [{'name': 'programming'}, {'name': 'economy'}],
'owner_org': 'd57869f3-dab8-45bb-abda-9e525a8e4520'
}

metadata_string = json.dumps(metadata_dict)

# r = requests.post(url = 'http://0.0.0.0:5000/api/action/package_create', 
# 	headers={'Content-Type': 'application/json', 'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJrcEVZT3EtRGNnYTgybENLa0s1OWNSVktMUHRrY1lKMWhNMC1tSHRwTF9FOGR5aFFVMGNzLV9RMjdPS0RBUTZQbG1Ccl9tUURTYVhob3RaQiIsImlhdCI6MTYxODc1Mjg4NH0.ze9gSbA1mljaqiIsUuQ9OSALsZldkjUg40bTq7fE-2M'},
# 	data = metadata_string)

# print(r)
# print(r.content)

# package_id = json.loads(r.content.decode('utf8').replace("'", '"'))['result']['id']
package_id = "80b5f43c-72bf-4611-bfde-2da5ce70d4bd"

resource_json = {'package_id': package_id, 'name': 'archive', 'url': 'my_dataset5/my-archive' }

print(resource_json)
r = requests.post(url = 'http://0.0.0.0:5000/api/action/resource_create', 
	headers={'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJrcEVZT3EtRGNnYTgybENLa0s1OWNSVktMUHRrY1lKMWhNMC1tSHRwTF9FOGR5aFFVMGNzLV9RMjdPS0RBUTZQbG1Ccl9tUURTYVhob3RaQiIsImlhdCI6MTYxODc1Mjg4NH0.ze9gSbA1mljaqiIsUuQ9OSALsZldkjUg40bTq7fE-2M'},
	data = resource_json,
	files={'upload': open('/home/wow-pc/Desktop/LasTOT/data-deposit/Cercetare/DataDeposit/static/dist/uploadDataset/admin_dataset.zip', 'rb')})

print(r)
print(r.content)

