import json
import logging

import azure.functions as func
import azure.cosmos as cosmos
import azure.cosmos.exceptions as exceptions
import os

#import config
import os 

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request to reject a matching user.')

    client = cosmos.cosmos_client.CosmosClient(os.environ['db_URI'], os.environ['db_key'] )
    db_client = client.get_database_client(os.environ['db_id'])
    accounts_container = db_client.get_container_client(os.environ['accounts_container'])

    req_body = req.get_json()
    id = req_body["id"]
    rejected_id = req_body["rejected_id"]

    matching_users = accounts_container.query_items(
        query='SELECT * FROM Accounts a WHERE a.id = @id',
        parameters=[{"name": "@id", "value": id}],
        enable_cross_partition_query=True,
    )

    matching_users = list(matching_users)
    
    message1 = {"result": True , "msg" : "Test Pass"} 
    message2 = {"result": False , "msg" : "Test Fail"} 

    if len(matching_users) == 1:
        account = matching_users[0]
        account["rejected"].append(rejected_id)
        accounts_container.upsert_item(account)
        return func.HttpResponse(body=json.dumps(message1))
    else:
        return func.HttpResponse(body=json.dumps(message2))

        