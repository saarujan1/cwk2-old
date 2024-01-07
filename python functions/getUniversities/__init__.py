import json
import logging
import azure.functions as func
import azure.cosmos as cosmos
import azure.cosmos.exceptions as exceptions

# import config
# cloud_URI = config.settings['cloud_URI']
# db_URI = config.settings['db_URI']
# db_id = config.settings['db_id']
# db_key = config.settings['db_key']
# accounts_cont = config.settings['accounts_container']
# filters_cont = config.settings['filters_container']
# university_data_cont = config.settings['university_data_container']
# app_key = config.settings['APP_KEY']

import os
cloud_URI = os.environ['cloud_URI']
db_URI = os.environ['db_URI']
db_id = os.environ['db_id']
db_key = os.environ['db_key']
accounts_cont = os.environ['accounts_container']
filters_cont = os.environ['filters_container']
university_data_cont = os.environ['university_data_container']
app_key = os.environ['APP_KEY']

# URI       getuniversities
# Input     {"text": being search to match against, "n": max number of results}
# Outputs   {"unis": []} - if text == "" then all unis are returned

def main(req: func.HttpRequest) -> func.HttpResponse:

    logging.info("Finding matching universities")
    
    client = cosmos.cosmos_client.CosmosClient(db_URI, db_key)
    db_client = client.get_database_client(db_id)
    university_data_container = db_client.get_container_client(university_data_cont)

    request = req.get_json()

    text = request["text"]
    n = request["n"]

    # Gets all uni names
    unis = list(university_data_container.query_items(
        query='SELECT a.name FROM UniversityData a',
        enable_cross_partition_query=True,
        ))
    unis = [uni["name"] for uni in unis]

    # Gets first the unis that start with text, then all others that contain text
    matches = [uni for uni in unis if uni.lower().startswith(text.lower())]
    matches += [uni for uni in unis if not(uni.lower().startswith(text.lower())) and (text.lower() in uni.lower())]

    # Gets upto n matches
    matches = matches[:min(len(matches), n)]
    
    return func.HttpResponse(body=json.dumps({"unis": matches}))