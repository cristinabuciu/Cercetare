from application_properties import *

from delete import deleteDataset
import es_connector
from datetime import datetime, timedelta, date
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.interval import IntervalTrigger

scheduler = BlockingScheduler()


# cleanup all datasets which are soft deleted more than CLEANUP_DATASETS_DAYS ago
@scheduler.scheduled_job(IntervalTrigger(days=1, start_date=(datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(hours= 8, minutes=30))))
def cleanupDatasets():
    deletedAtBefore = datetime.now() - timedelta(days = CLEANUP_DATASETS_DAYS)
    print("[cleanup] Started clean-up process for all datasets deleted before {}".format(deletedAtBefore.strftime('%d-%m-%Y')))
    
    es = es_connector.ESClass(server=DATABASE_IP, port=DATABASE_PORT)
    es.connect()

    datasetsToBeDeleted = es.get_datasets_cleanup(INDEX_DATASETS, int(deletedAtBefore.timestamp()))

    if not datasetsToBeDeleted:
        return

    datasetsIDs = list(map(lambda x: x['_source']['id'], datasetsToBeDeleted))
    print("Performing cleanup for datasetsIDs={}".format(datasetsIDs))
    
    for dataset in datasetsToBeDeleted:
        deleteDataset(dataset['_source']['id'])

scheduler.start()