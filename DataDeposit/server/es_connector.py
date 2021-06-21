from application_properties import INDEX_DATASETS, INDEX_DOMAINS, INDEX_COMMENTS, INDEX_TAGS, INDEX_USERS, INDEX_ID_GENERATOR

from elasticsearch import Elasticsearch, RequestsHttpConnection
import urllib3


# connector class
class ESClass(object):
    MATCH_ALL_QUERY = {'query': {'match_all': {}}}
    DEFAULT_SIZE = 2000

    def __init__(self, server, port, use_ssl=False, user='', password=''):
        self.server = server
        self.port = port
        self.use_ssl = use_ssl
        self.user = user
        self.password = password
        self.es = None

    # connect function
    def connect(self):
        urllib3.disable_warnings()
        self.es = Elasticsearch(
            [self.server],
            connection_class=RequestsHttpConnection,
            http_auth=(self.user, self.password),
            port=self.port,
            use_ssl=self.use_ssl,
            verify_certs=False,
        )

    # query function
    def query(self, index, query, size):
        if size > 10000:
            hits = []
            s = self.es.search(index=index, body=query, size=10000, scroll='1m')
            scroll_id = s['_scroll_id']
            hits += s['hits']['hits']
            total_size = min(s['hits']['total'], size)
            number_of_scrolls = int(total_size / 10000)
            for iter in range(number_of_scrolls):
                s = self.es.scroll(scroll_id=scroll_id, scroll='1m')
                hits += s['hits']['hits']
        else:
            s = self.es.search(index=index, body=query, size=size)
            if s['hits']['hits']:
                if size == 1:
                    return s['hits']['hits'][0]
                else:
                    return s['hits']['hits'][0:size]
            else:
                return []

    # get ElasticSearch ID
    def get_es_id(self, index, query):
        s = self.es.search(index=index, body=query, size=1)
        return s['hits']['hits'][0]['_id']

    # get elements by index
    def get_es_index(self, index):
        s = self.es.search(index=index, body=ESClass.MATCH_ALL_QUERY, size=self.DEFAULT_SIZE)
        return s['hits']['hits']
    
    def get_es_data_by_id(self, index, id):
        searchJson = {"query": { "match": {"id": id } } }

        s = self.es.search(index=index, body=searchJson, size=self.DEFAULT_SIZE)
        return s['hits']['hits']
    
    def get_domain_by_name(self, domainName):
        searchJson = {"query": { "match": {"domainName": domainName } } }

        s = self.es.search(index=INDEX_DOMAINS, body=searchJson, size=self.DEFAULT_SIZE)
        return s['hits']['hits']
    
    def get_dataset_comments(self, datasetId):
        searchJson = {"query": { "match": {"datasetID": datasetId } } }

        s = self.es.search(index=INDEX_COMMENTS, body=searchJson, size=self.DEFAULT_SIZE)
        return s['hits']['hits']
    
    def get_tag_of_domain(self, domainName, tagName):
        searchJson = {"query": {"bool": {"must": [
            {"match": {"domainName": domainName}},
            {"match": {"tagName": tagName}}
            ]}}}

        s = self.es.search(index=INDEX_TAGS, body=searchJson, size=self.DEFAULT_SIZE)
        return s['hits']['hits']
    
    def get_user_by_name(self, username):
        searchJson = {"query": { "match": {"username": username } } }

        s = self.es.search(index=INDEX_USERS, body=searchJson, size=self.DEFAULT_SIZE)
        return s['hits']['hits']

    def get_filtered_datasets(self, domain, country, year, order, orderField, userId, shouldDisplayPrivate):
        s = self.es.search(index=INDEX_DATASETS, body=self.match_dataset(domain, country, year, order, orderField, userId, shouldDisplayPrivate), size=self.DEFAULT_SIZE)
        return s['hits']['hits']

    @staticmethod
    def match_dataset(domain, country, year, order, orderField, userId, shouldDisplayPrivate):
        # Search pattern
        searchJson = {"query": { "bool": {"must": [
            {"wildcard": {"domain": {"value": domain.lower()}}},
            {"wildcard": {"country": {"value": country.lower()}}},
            {"wildcard": {"year": {"value": year.lower()}}},
            {"match": {"deleted": False}}
            ]}}}

        # Used for the user page
        if userId:
            searchJson['query']['bool']['must'].append({"match": {"ownerId": int(userId)}})

        # If this is set on true, datasets are displayed on the user page
        # Otherwise, datasets are displayed on the main page
        if not shouldDisplayPrivate:
            searchJson['query']['bool']['must'].append({"match": {"private": False}})

        # Sort the result
        if orderField.lower() == "dataset_title":
            orderField += ".raw"
        sortList = [ { orderField.lower(): {"order": order.lower()} } ]
        if order.lower() == 'none':
            return searchJson
        else:
            searchJson["sort"] = sortList
            return searchJson

    def get_public_datasets(self):
        body = {"query": { "bool": {"must": [ {"match": {"deleted": False}}, {"match": {"private": False}} ] } } }
        s = self.es.search(index=INDEX_DATASETS, body=body, size=self.DEFAULT_SIZE)
        return s['hits']['hits']

    def count_datasets_by_ownerId(self, ownerId, isPrivate):
        body = {"query": { "bool": {"must": [{"match": {"deleted": False}},
                                             { "match": {"ownerId": int(ownerId) } },
                                             { "match": {"private": isPrivate } }] }}}

        s = self.count(INDEX_DATASETS, body)
        return s['count']
    
    # update dataset rating
    def update_dataset_rating(self, datasetId, newRatingValue, newRatingNumber):
        body = { "script" : { "source": "ctx._source.avg_rating_value=" + str(newRatingValue) + ";" + "ctx._source.ratings_number=" + str(newRatingNumber) + ";", "lang": "painless" },
                 "query": { "term" : { "id": datasetId } } }

        self.update_by_query(INDEX_DATASETS, body)
    
    # update dataset views
    def update_dataset_views(self, datasetId):
        body = { "script" : { "source": "ctx._source.views++", "lang": "painless" }, "query": { "term" : { "id": datasetId } } }

        self.update_by_query(INDEX_DATASETS, body)

    # update dataset downloads
    def update_dataset_downloads(self, datasetId):
        body = { "script" : { "source": "ctx._source.downloads_number++", "lang": "painless" }, "query": { "term" : { "id": datasetId } } }

        self.update_by_query(INDEX_DATASETS, body)
    
    def soft_delete_dataset_comments(self, datasetId, deletedAt):
        body = { "script" : { "source": "ctx._source.deleted=true;" + "ctx._source.deletedAt=" + str(deletedAt) + ";", "lang": "painless" }, "query": { "term" : { "datasetID": datasetId } } }

        self.update_by_query(INDEX_COMMENTS, body)

    def soft_delete_dataset(self, datasetId, deletedAt):
        body = { "script" : { "source": "ctx._source.deleted=true;" + "ctx._source.deletedAt=" + str(deletedAt) + ";" + "ctx._source.lastUpdatedAt=" + str(deletedAt) + ";", "lang": "painless" },
                 "query": { "term" : { "id": datasetId } } }

        self.update_by_query(INDEX_DATASETS, body)
    
    def hard_delete_dataset_comments(self, datasetId):
        body = {"query": {"match": {"datasetID": datasetId}}}
        self.es.delete_by_query(INDEX_COMMENTS, body)

    def hard_delete_dataset(self, datasetId):
        body = {"query": {"match": {"id": datasetId}}}
        self.es.delete_by_query(INDEX_DATASETS, body)
    
    def hard_delete_comment(self, commentId):
        body = {"query": {"match": {"id": commentId}}}
        self.es.delete_by_query(INDEX_COMMENTS, body)

    def update_id_generator(self, field):
        body = { "script" : { "source": "ctx._source." + field + "++", "lang": "painless" } }
        self.update_by_query(INDEX_ID_GENERATOR, body)
    
    # Cleanup datasets
    def get_datasets_cleanup(self, deletedAtBefore):
        body = {"query": {"bool": {"must": [{"range": {"deletedAt": {"lte": deletedAtBefore} } }, { "match": {"deleted": True } }]}}}

        s = self.es.search(index=INDEX_DATASETS, body=body)
        return s['hits']['hits']

    # insert function
    def insert(self, index, doc_type, body, refresh='false'):
        params = {'refresh': refresh}
        return self.es.index(index=index, doc_type=doc_type, body=body, params=params)

    # update function
    def update(self, index, doc_type, doc_id, body, refresh='false'):
        params = {'refresh': refresh}
        return self.es.index(index=index, doc_type=doc_type, id=doc_id, body=body, params=params)

    # delete function
    def delete(self, index, doc_type, event_id):
        return self.es.delete(index=index, doc_type=doc_type, id=event_id)

    def delete_by_query(self, index, doc_type, q):
        return self.es.delete_by_query(index=index, body=q)

    # delete all from index
    def delete_all(self, index, doc_type):
        return self.es.delete_by_query(index=index, body=ESClass.MATCH_ALL_QUERY)

    # update function
    def update2(self, index, doc_type, doc_id, body):
        self.es.update(index=index, doc_type=doc_type, id=doc_id, body=body)
    
    # update by query
    def update_by_query(self, index, body):
        self.es.update_by_query(index, body)

    # create index
    def create_index(self, index, mapping):
        self.es.indices.create(index=index, body=mapping)

    # update index mapping
    def put_mapping(self, index, doc_type, mapping):
        self.es.indices.put_mapping(index=index, doc_type=doc_type, body=mapping)

    # delete index
    def delete_index(self, index):
        self.es.indices.delete(index=index)
    
    # count documents by query
    def count(self, index, body):
        return self.es.count(index=index, body=body)

    # bulk operation
    def bulk_insert(self, index, doc_type, json_data):
        self.es.bulk(index=index, doc_type=doc_type, body=json_data)
