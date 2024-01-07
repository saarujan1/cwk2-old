import json
import logging

import azure.functions as func
import azure.cosmos as cosmos
import azure.cosmos.exceptions as exceptions
import os
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

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request to get a user account.')

    client = cosmos.cosmos_client.CosmosClient(db_URI, db_key)
    db_client = client.get_database_client(db_id)
    accounts_container = db_client.get_container_client(accounts_cont)
    filters_container = db_client.get_container_client(filters_cont)

    req_body = req.get_json()
    id = req_body["id"]
    password = req_body["password"]
    message2 = {"result": False , "msg" : "Test Fail"} 
    
    try:

        userAccountinfo = list(accounts_container.query_items('SELECT a.password FROM a WHERE a.id=\"' + id + '\"', enable_cross_partition_query=True))[0]

        #Check password matches hash in DB
        if(userAccountinfo['password'] == password):
            
                try:
                    matching_users = accounts_container.query_items(
                        query='SELECT * FROM Accounts a WHERE a.id = @id',
                        parameters=[{"name": "@id", "value": id}],
                        enable_cross_partition_query=True,
                    )

                    matching_users = list(matching_users)

                    matching_filters = filters_container.query_items(
                        query='SELECT * FROM Filters a WHERE a.id = @id',
                        parameters=[{"name": "@id", "value": id}],
                        enable_cross_partition_query=True,
                    )

                    matching_filters = list(matching_filters)
                    
                    message1 = {"result": True , "msg" : "Test Pass", "account": matching_users[0],"filters":matching_filters[0]} 
                
                except:
                    return func.HttpResponse(body=json.dumps(message2))

                if len(matching_users) == 1:
                    return func.HttpResponse(body=json.dumps(message1))
                else:
                    return func.HttpResponse(body=json.dumps(message2))

        else:
            #wrong password
            return func.HttpResponse(body=json.dumps(message2))
    except:
        return func.HttpResponse(body=json.dumps(message2))




        