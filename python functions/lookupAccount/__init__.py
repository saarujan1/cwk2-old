import json
import logging

import azure.functions as func
import azure.cosmos as cosmos
import azure.cosmos.exceptions as exceptions
import os

#import config
#import os 

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request to get a user account.')

    client = cosmos.cosmos_client.CosmosClient(os.environ['db_URI'], os.environ['db_key'] )
    db_client = client.get_database_client(os.environ['db_id'])
    accounts_container = db_client.get_container_client(os.environ['accounts_container'])
    filters_container = db_client.get_container_client(os.environ['filters_container'])

    req_body = req.get_json()
    id = req_body["id"]

    matching_users = accounts_container.query_items(
        query='SELECT a.id, a.profile_pic_id, a.bio, a.hobbies, a.age, a.accepted, a.rejected, a.matched FROM Accounts a WHERE a.id = @id',
        parameters=[{"name": "@id", "value": id}],
        enable_cross_partition_query=True,
    )
    user_filters = filters_container.query_items(
        query='SELECT a.university,a.course,a.modules,a.year,a.language FROM Filters a WHERE a.id = @id',
        parameters=[{"name": "@id", "value": id}],
        enable_cross_partition_query=True,
    )

    matching_users = list(matching_users)
    user_filters = list(user_filters)
    
    message1 = {"result": True , "msg" : "Test Pass", "account": matching_users[0],"filters": user_filters[0]} # 
    message2 = {"result": False , "msg" : "Test Fail"} 

    if len(matching_users) == 1:
        return func.HttpResponse(body=json.dumps(message1))
    else:
        return func.HttpResponse(body=json.dumps(message2))

        