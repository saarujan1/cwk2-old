import json
import logging
import azure.functions as func
import azure.cosmos as cosmos
import azure.cosmos.exceptions as exceptions
import bcrypt 
import config

cloud_URI = config.settings['cloud_URI']
db_URI = config.settings['db_URI']
db_id = config.settings['db_id']
db_key = config.settings['db_key']
accounts_cont = config.settings['accounts_container']
filters_cont = config.settings['filters_container']
app_key = config.settings['APP_KEY']

# import os
# cloud_URI = os.environ['cloud_URI']
# db_URI = os.environ['db_URI']
# db_id = os.environ['db_id']
# db_key = os.environ['db_key']
# accounts_cont = os.environ['accounts_container']
# filters_cont = os.environ['filters_container']
# app_key = os.environ['APP_KEY']

#Outputs: 
message2 = {"result": False , "msg": "Username or password incorrect"}  

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Checking credentials...')

    client = cosmos.cosmos_client.CosmosClient(db_URI, db_key)
    db_client = client.get_database_client(db_id)
    accounts_container = db_client.get_container_client(accounts_cont)
    filters_container = db_client.get_container_client(filters_cont)

    player = req.get_json()
    username = player['username']
    password = player['password']
    try:
        userAccountinfo = list(accounts_container.query_items('SELECT a.id, a.password, a.email, a.profile_pic_id, a.phone, a.bio, a.hobbies, a.accepted, a.rejected, a.matched, a.communicationID FROM a WHERE a.id=\"' + username + '\"', enable_cross_partition_query=True))[0]
        userFilterinfo = list(filters_container.query_items('SELECT a.id, a.university, a.course, a.year, a.language, a.study_method, a.study_time FROM a WHERE a.id=\"' + username + '\"', enable_cross_partition_query=True))[0]

        if(userAccountinfo['password'] == password):
            return func.HttpResponse(body=json.dumps({"result": True, "accountData": userAccountinfo, "filterInfo": userFilterinfo}))
        else:
            return func.HttpResponse(body=json.dumps(message2))
    except:
        return func.HttpResponse(body=json.dumps(message2))