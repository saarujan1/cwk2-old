import json
import logging
import azure.functions as func
import azure.cosmos as cosmos
import azure.cosmos.exceptions as exceptions
import re
from azure.communication.identity import CommunicationIdentityClient, CommunicationUserIdentifier
import os
connection_string = os.environ["COMMUNICATION_SERVICES_CONNECTION_STRING"]

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('getting a token in progress....')
    sent = req.get_json()
    logging.info(sent)
    id = sent['comID']

    #instantiate communicationservice
    comClient = CommunicationIdentityClient.from_connection_string(connection_string)

    token_result = comClient.get_token(CommunicationUserIdentifier(id), ["chat"])

    #debug
    logging.info("\nIssued an access token with 'chat' scope that expires at " + token_result.expires_on + ":")
    logging.info(token_result.token)
    
    return func.HttpResponse(body=json.dumps({"token":token_result.token}))