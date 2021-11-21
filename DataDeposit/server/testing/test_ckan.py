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
b = requests.get('http://0.0.0.0:5000/api/action/current_package_list_with_resources')
pprint.pprint(json.loads(b.content.decode('utf8').replace("'", '"'))['result'])


# INSERT PACKAGE
metadata_dict = {'name': 'my_dataset5', 'private': False, 'author': 'John', 'author_email': 'a@a.com', 'maintainer': 'Alex', 'maintainer_email': 'alex@a.com', 'notes': 'ajsfiosdhifujsd',
'groups': [{'name': 'it'}],
'tags': [{'name': 'programming'}, {'name': 'economy'}],
'owner_org': 'd57869f3-dab8-45bb-abda-9e525a8e4520'
}

metadata_string = json.dumps(metadata_dict)

r = requests.post(url = 'http://0.0.0.0:5000/api/action/package_create',
	headers={'Content-Type': 'application/json', 'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJrcEVZT3EtRGNnYTgybENLa0s1OWNSVktMUHRrY1lKMWhNMC1tSHRwTF9FOGR5aFFVMGNzLV9RMjdPS0RBUTZQbG1Ccl9tUURTYVhob3RaQiIsImlhdCI6MTYxODc1Mjg4NH0.ze9gSbA1mljaqiIsUuQ9OSALsZldkjUg40bTq7fE-2M'},
	data = metadata_string)

print(r)
print(r.content)

# INSERT RESOURCE

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


# UPDATE PACKAGE
p_id = "54090c4e-6bae-43ba-8143-c084e8aa5d8e"
b = requests.get('http://0.0.0.0:5000/api/action/package_show?id=' + p_id)
existing = json.loads(b.content.decode('utf8').replace("'", '"'))['result']
existing['title'] = "HATZ"
r = requests.post(url = 'http://0.0.0.0:5000/api/action/package_update?id=' + p_id,
				  headers={'Content-Type': 'application/json', 'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJrcEVZT3EtRGNnYTgybENLa0s1OWNSVktMUHRrY1lKMWhNMC1tSHRwTF9FOGR5aFFVMGNzLV9RMjdPS0RBUTZQbG1Ccl9tUURTYVhob3RaQiIsImlhdCI6MTYxODc1Mjg4NH0.ze9gSbA1mljaqiIsUuQ9OSALsZldkjUg40bTq7fE-2M'},
				  data = json.dumps(existing))
print(r.content)

# UPDATE RESOURCE
r_id = "20f734a6-06f0-4ef4-bb1d-0f6e2befacfc"
r = requests.post(url = 'http://0.0.0.0:5000/api/action/resource_update',
				  headers={'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJrcEVZT3EtRGNnYTgybENLa0s1OWNSVktMUHRrY1lKMWhNMC1tSHRwTF9FOGR5aFFVMGNzLV9RMjdPS0RBUTZQbG1Ccl9tUURTYVhob3RaQiIsImlhdCI6MTYxODc1Mjg4NH0.ze9gSbA1mljaqiIsUuQ9OSALsZldkjUg40bTq7fE-2M'},
				  data = {'id': r_id, 'name': 'new-resource'},
				  files={'upload': open('/home/wow-pc/Desktop/test.zip', 'rb')})
print(r.content)

# DELETE RESOURCE
r_id = "20f734a6-06f0-4ef4-bb1d-0f6e2befacfc"
r = requests.post(url = 'http://0.0.0.0:5000/api/action/resource_delete',
				  headers={'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJrcEVZT3EtRGNnYTgybENLa0s1OWNSVktMUHRrY1lKMWhNMC1tSHRwTF9FOGR5aFFVMGNzLV9RMjdPS0RBUTZQbG1Ccl9tUURTYVhob3RaQiIsImlhdCI6MTYxODc1Mjg4NH0.ze9gSbA1mljaqiIsUuQ9OSALsZldkjUg40bTq7fE-2M'},
				  data={'id': r_id})
print(r.content)

# DELETE PACKAGE
p_id = "54090c4e-6bae-43ba-8143-c084e8aa5d8e"
r = requests.post(url = 'http://0.0.0.0:5000/api/action/package_delete',
				  headers={'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJrcEVZT3EtRGNnYTgybENLa0s1OWNSVktMUHRrY1lKMWhNMC1tSHRwTF9FOGR5aFFVMGNzLV9RMjdPS0RBUTZQbG1Ccl9tUURTYVhob3RaQiIsImlhdCI6MTYxODc1Mjg4NH0.ze9gSbA1mljaqiIsUuQ9OSALsZldkjUg40bTq7fE-2M'},
				  data={'id': p_id})
print(r.content)