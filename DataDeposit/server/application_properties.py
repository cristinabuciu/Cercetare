FLASK_SECRET_KEY = 'development'

DATABASE_IP = '172.24.0.2'
DATABASE_PORT = 9200
INDEX_USERS = 'logintable'
INDEX_LOCATIONS = 'locations'
INDEX_DATASETS = 'datasets'
INDEX_DOMAINS = 'domains'
INDEX_TAGS = 'tags'
INDEX_COMMENTS = 'comments'
INDEX_ID_GENERATOR = 'id_generator'

UPLOAD_FOLDER_PATH = './uploadFiles'
UPLOAD_FILE_ALLOWED_EXTENSIONS = ['csv', 'zip', 'tar.gz', 'jpg']
FLASK_STATIC_FOLDER = "../static"
FLASK_TEMPLATE_FOLDER = "../static/dist" # imagini

CKAN_INSTANCE_BASE_URL = 'http://0.0.0.0:5000/api'
CKAN_INSTANCE_DATASET_DOWNLOAD_URL = 'http://0.0.0.0:5000/dataset/{}/resource/{}/download/file'
CKAN_INSTANCE_JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJrcEVZT3EtRGNnYTgybENLa0s1OWNSVktMUHRrY1lKMWhNMC1tSHRwTF9FOGR5aFFVMGNzLV9RMjdPS0RBUTZQbG1Ccl9tUURTYVhob3RaQiIsImlhdCI6MTYxODc1Mjg4NH0.ze9gSbA1mljaqiIsUuQ9OSALsZldkjUg40bTq7fE-2M'
CKAN_INSTANCE_ORG_ID = 'd57869f3-dab8-45bb-abda-9e525a8e4520'

SOFT_DELETE = True
CLEANUP_DATASETS_ENABLED = False
CLEANUP_DATASETS_DAYS = 30