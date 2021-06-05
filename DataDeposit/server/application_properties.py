FLASK_SECRET_KEY = 'development'
FLASK_STATIC_FOLDER = "../static"
FLASK_TEMPLATE_FOLDER = "../static/dist"  # images

DATABASE_IP = '172.26.0.2'
DATABASE_PORT = 9200
INDEX_USERS = 'logintable'
INDEX_LOCATIONS = 'locations'
INDEX_DATASETS = 'datasets'
INDEX_DOMAINS = 'domains'
INDEX_TAGS = 'tags'
INDEX_COMMENTS = 'comments'
INDEX_ID_GENERATOR = 'id_generator'

UPLOAD_FOLDER_PATH = './uploadFiles'
UPLOAD_FILE_SIZE_MAX = 100 * 1000 * 1000  # 100 MB

# https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
UPLOAD_FILE_ALLOWED_MIME_TYPES = {
    'application/zip': 'zip',
    'application/x-tar': 'tar',
    'application/gzip': 'gz',
    'application/vnd.rar': 'rar',
    'application/x-7z-compressed': '7z',
    'application/json': 'json',
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'text/csv': 'csv'
}

CKAN_INSTANCE_BASE_URL = 'http://0.0.0.0:5000/api'
CKAN_INSTANCE_JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJ6azNlTzE4cTRNX0Z1clR0RHFTR3hpRkhJWXVPOW9Xb0JrLTdBc0UxSUZhVUducVJmaXpCbGFhQk00MjRPdmt2UFJSZjZRODN3UGJFM1hoSiIsImlhdCI6MTYyMjg5MjQ3Nn0.yjM3ZJ_mDllKpgRAjBFQMPPNNjbTWSZep00SrqxSHRM'
CKAN_INSTANCE_ORG_ID = '2e132566-028e-4cbc-9f51-2f87b329937d'

SOFT_DELETE = True
CLEANUP_DATASETS_ENABLED = False
CLEANUP_DATASETS_DAYS = 30
