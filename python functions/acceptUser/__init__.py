import json
import logging

import azure.functions as func
import azure.cosmos as cosmos
import azure.cosmos.exceptions as exceptions
import os
from azure.communication.identity import CommunicationIdentityClient, CommunicationUserIdentifier
from datetime import datetime
from azure.communication.chat import ChatParticipant, ChatClient, CommunicationTokenCredential
#import config
import os 

connection_string = os.environ["COMMUNICATION_SERVICES_CONNECTION_STRING"]
funcIdentity = '8:acs:cecc501c-25ca-4b1c-a4fd-a786b9c9f431_00000016-3178-519a-c187-af3a0d00e6f2'
endpoint = 'https://cw2comser.communication.azure.com/'
def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request to accept a matching user.')

    client = cosmos.cosmos_client.CosmosClient(os.environ['db_URI'], os.environ['db_key'] )
    db_client = client.get_database_client(os.environ['db_id'])
    accounts_container = db_client.get_container_client(os.environ['accounts_container'])

    req_body = req.get_json()
    id = req_body["id"]
    accepted_id = req_body["accepted_id"]

    matching_users = accounts_container.query_items(
        query='SELECT * FROM Accounts a WHERE a.id = @id',
        parameters=[{"name": "@id", "value": id}],
        enable_cross_partition_query=True,
    )
    accepted_users = accounts_container.query_items(
        query='SELECT * FROM Accounts a WHERE a.id = @id',
        parameters=[{"name": "@id", "value": accepted_id}],
        enable_cross_partition_query=True,
    )

    matching_users = list(matching_users)
    accepted_users = list(accepted_users)
    message1 = {"result": True , "msg" : "Test Pass"} 
    message2 = {"result": False , "msg" : "Test Fail"}
    message3 = {"result":False , "msg":"Failed Creating Chat- Abort"}
    logging.info(str(len(matching_users)) + "and " + str(len(accepted_users)))
    if len(matching_users) == 1 and len(accepted_users) == 1:
        account = matching_users[0]
        account["accepted"].append(accepted_id)
        
        #Then add to matches
        accepted_account = accepted_users[0]
        if(id in accepted_account["accepted"]):
            print('match')
            account["matched"].append(accepted_id)
            accepted_account["matched"].append(id)
            #create chat for the two id's
            #try:
            createChat(account,accepted_account)
            #except:
            #    return func.HttpResponse(body=json.dumps(message3))

        accounts_container.upsert_item(accepted_account)
        accounts_container.upsert_item(account)
        return func.HttpResponse(body=json.dumps(message1))
    else:
        return func.HttpResponse(body=json.dumps(message2))

def createChat(id1,id2):
    #get token
    comClient = CommunicationIdentityClient.from_connection_string(connection_string)
    token_result = comClient.get_token(CommunicationUserIdentifier(funcIdentity), ["chat"])
    #create server chatclient and 
    topic="test topic"
    chat_client = ChatClient(endpoint, CommunicationTokenCredential(token_result.token))

    #create chat
    create_chat_thread_result = chat_client.create_chat_thread(topic)
    chat_thread_client = chat_client.get_chat_thread_client(create_chat_thread_result.chat_thread.id)

    #add users
    chatMembers = []
    participant1 = ChatParticipant(
    identifier=CommunicationUserIdentifier(id1["communicationID"]),
    display_name=id1["id"],
    share_history_time=datetime.utcnow())
    chatMembers.append(participant1)

    participant2 = ChatParticipant(
    identifier=CommunicationUserIdentifier(id2["communicationID"]),
    display_name=id2["id"],
    share_history_time=datetime.utcnow())
    chatMembers.append(participant2)

    chat_thread_client.add_participants(chatMembers)


