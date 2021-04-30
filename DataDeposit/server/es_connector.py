from elasticsearch import Elasticsearch, RequestsHttpConnection
import urllib3
import json

# connector class
class ESClass(object):
    MATCH_ALL_QUERY = {'query': {'match_all': {}}}

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

    # old query for matching branch name
    def match_branch_query(self, branch):
        # {"query": { "bool": { "must": [{ "match": { "branch": branch }}, { "match": { "state": state }}]}}}
        # return {"query": { "bool": { "must": [{ "match": { "branch": branch }}]}}}
        # return {'query': {'must': [{'term': {'branch': branch}}]}}
        return {'query': {'match': { 'branch': branch}}}

    # new query for matching branch name
    def match_vip_branch_query(self, branch):
        return {"query": {"match_phrase": {"branch": branch}}}

    # delete the vip with specified branch name
    def delete_by_branch(self, index, branch):
        return self.es.delete_by_query(index=index, body=self.match_vip_branch_query(branch))

    # get element by branch
    def get_es_branch(self, index, branch):
        s = self.es.search(index=index, body=self.match_vip_branch_query(branch), size=1)
        return s['hits']['hits'][0]

    # get elements by index
    def get_es_index(self, index):
        s = self.es.search(index=index, body=ESClass.MATCH_ALL_QUERY, size=2000)
        return s['hits']['hits']#['total']
    
    def get_es_data(self, index, domain, country, data_format, year, dataset_title, order, orderField, userId, shouldDisplayPrivate):
        DATASETS_MATCH = "{\"sort\": [ { \"dataset_title\": {\"order\": \"desc\"} } ], \
                \"query\": { \
                    \"bool\": { \
                    \"must\": [ \
                        {}\
                        { \
                        \"match_phrase\": { \
                            \"domain\": \"" + domain + "\" \
                        } \
                        }, \
                        { \
                        \"match_phrase\": { \
                            \"country\": \" " + country +" \" \
                        } \
                        }, \
                        { \
                        \"match_phrase\": { \
                            \"data_format\": \"" + data_format + "\" \
                        } \
                        }, \
                        {  \
                        \"match_phrase\": { \
                            \"year\": \"" + year + "\" \
                        } \
                        } \
                    ] \
                    } \
                } \
            }"
            
        # a = json.loads(DATASETS_MATCH)
        s = self.es.search(index=index, body=self.match_dataset(domain, country, data_format, year, dataset_title, order, orderField, userId, shouldDisplayPrivate), size=2000)
        return s['hits']['hits']#['total']
    
    def get_es_data_by_id(self, index, id):
        searchJson = {"query": { "match": {"id": id } } }

        s = self.es.search(index=index, body=searchJson, size=2000)
        return s['hits']['hits']#['total']
    
    def get_es_data_by_domainName(self, index, domainName):
        searchJson = {"query": { "match": {"domainName": domainName } } }

        s = self.es.search(index=index, body=searchJson, size=2000)
        return s['hits']['hits']#['total']
    
    def get_es_data_by_datasetID(self, index, datasetID):
        # searchJson = {"query": {"bool": {"must": {"match": {"datasetID": datasetID }}}},
        #  "sort": {"createdAt": {"order": "desc"}}}
        searchJson = {"query": { "match": {"datasetID": datasetID } } }

        s = self.es.search(index=index, body=searchJson, size=2000)
        return s['hits']['hits']#['total']
    
    def get_es_data_by_domainName_and_tagName(self, index, domainName, tagName):
        searchJson = {"query": {"bool": {"must": [
            {"match": {"domainName": domainName}},
            {"match": {"tagName": tagName}}
            ]}}}

        s = self.es.search(index=index, body=searchJson, size=2000)
        return s['hits']['hits']#['total']
    
    def get_es_data_by_userName(self, index, username):
        searchJson = {"query": { "match": {"username": username } } }

        s = self.es.search(index=index, body=searchJson, size=2000)
        return s['hits']['hits']#['total']

    def match_dataset(self, domain, country, data_format, year, dataset_title, order, orderField, userId, shouldDisplayPrivate):
        # Search pattern
        searchJson = {"query": { "bool": {"must": [
            {"wildcard": {"domain": {"value": domain.lower()}}}, 
            {"wildcard": {"country": {"value": country.lower()}}},
            {"wildcard": {"data_format": {"value": data_format.lower()}}},
            {"wildcard": {"year": {"value": year.lower()}}},
            {"wildcard": {"dataset_title": {"value": dataset_title.lower()}}},
            {"match": {"deleted": False}}
            ]}}}

        # Used for the user page
        if userId:
            searchJson['query']['bool']['must'].append({"match": {"ownerId": int(userId)}})
        
        # If this is set on true, datasets are displayed on the user page
        # Otherwise, datasets are displayed on the main page
        if not(shouldDisplayPrivate):
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


    def count_es_data_by_ownerId(self, index, ownerId, isPrivate):
        # body = {"query": { "match": {"ownerId": int(ownerId) } } }
        body = {"query": { "bool": {"must": [
            { "match": {"ownerId": int(ownerId) } },
            { "match": {"private": isPrivate } }]}}}

        s = self.count(index, body)
        return s['count']
    
    def count_es_data(self, index):
        # body = {"query": { "match": {"ownerId": int(ownerId) } } }

        s = self.count(index, self.MATCH_ALL_QUERY)
        return s['count']
    
    # update dataset rating
    def update_dataset_rating(self, index, datasetID, newRatingValue, newRatingNumber):
        body = { "script" : { "source": "ctx._source.avg_rating_value=" + str(newRatingValue) + ";" + "ctx._source.ratings_number=" + str(newRatingNumber) + ";", "lang": "painless" }, "query": { "term" : { "id": datasetID } } }

        self.update_by_query(index, body)
    
    # update dataset views
    def update_dataset_views(self, index, datasetID):
        body = { "script" : { "source": "ctx._source.views++", "lang": "painless" }, "query": { "term" : { "id": datasetID } } }

        self.update_by_query(index, body)
    
    def soft_delete_comments_by_dataset_id(self, index, datasetId, currentTimestamp):
        body = { "script" : { "source": "ctx._source.deleted=true;" + "ctx._source.deletedAt=" + str(currentTimestamp) + ";", "lang": "painless" }, "query": { "term" : { "datasetID": datasetId } } }

        self.update_by_query(index, body)

    def soft_delete_dataset_by_id(self, index, datasetId, currentTimestamp):
        body = { "script" : { "source": "ctx._source.deleted=true;" + "ctx._source.deletedAt=" + str(currentTimestamp) + ";" + "ctx._source.lastUpdatedAt=" + str(currentTimestamp) + ";", "lang": "painless" }, "query": { "term" : { "id": datasetId } } }

        self.update_by_query(index, body)
    
    def delete_comments_by_dataset_id(self, index, datasetId):
        body = {"query": {"match": {"datasetID": datasetId}}}
        self.es.delete_by_query(index, body)

    def delete_dataset_by_id(self, index, datasetId):
        body = {"query": {"match": {"id": datasetId}}}
        self.es.delete_by_query(index, body)
    
    def delete_comment_by_id(self, index, commentId):
        body = {"query": {"match": {"id": commentId}}}
        self.es.delete_by_query(index, body)

    def update_id_generator(self, index, field):
        body = { "script" : { "source": "ctx._source." + field + "++", "lang": "painless" } }

        self.update_by_query(index, body)
    
    # Cleanup datasets
    def get_datasets_cleanup(self, index, deletedAtBefore):
        body = {"query": {"bool": {"must": [{"range": {"deletedAt": {"lte": deletedAtBefore} } }, 
        { "match": {"deleted": True } }
        ] }}}

        s = self.es.search(index=index, body=body)
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


# es = ESClass(server='kibana-api.ne.adobe.net', port=443, use_ssl=True, user='', password='')
# es.connect()
