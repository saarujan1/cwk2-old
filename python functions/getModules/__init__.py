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

# URI       getmodules
# Input     {"text": being search to match against, "university": their uni to check for courses in, "course": , "n": max number of results}
# Outputs   {"modules": []} - all matches sorted most to least used, if text == "" then all modules in the course are returned

def main(req: func.HttpRequest) -> func.HttpResponse:

    logging.info("Finding matching modules")
    
    client = cosmos.cosmos_client.CosmosClient(db_URI, db_key)
    db_client = client.get_database_client(db_id)
    university_data_container = db_client.get_container_client(university_data_cont)

    request = req.get_json()

    text = request["text"]
    university = request["university"]
    course = request["course"]
    n = request["n"]

    # Gets all uni names
    courses = list(university_data_container.query_items(
        query='SELECT a.courses FROM UniversityData a WHERE a.name = @uni',
        parameters=[{"name": "@uni", "value": university}],
        enable_cross_partition_query=True,
        ))[0]["courses"]

    modules = [uni_course for uni_course in courses if uni_course["name"] == course][0]["modules"]

    # Gets first the courses that contain text
    matches = [module for module in modules if text.lower() in module["name"].lower()]

    matches = sorted(matches, key=lambda d: d['count'], reverse=True) 

    # Gets upto n matches
    matches = matches[:min(len(matches), n)]
    
    return func.HttpResponse(body=json.dumps({"modules": matches}))