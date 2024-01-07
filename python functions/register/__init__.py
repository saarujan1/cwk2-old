import json
import logging
import azure.functions as func
import azure.cosmos as cosmos
import azure.cosmos.exceptions as exceptions
import re
from azure.communication.identity import CommunicationIdentityClient, CommunicationUserIdentifier
import bcrypt
# import config
# cloud_URI = config.settings['cloud_URI']
# db_URI = config.settings['db_URI']
# db_id = config.settings['db_id']
# db_key = config.settings['db_key']
# accounts_cont = config.settings['accounts_container']
# filters_cont = config.settings['filters_container']
# connection_string = config.settings["COMMUNICATION_SERVICES_CONNECTION_STRING"]

import os
cloud_URI = os.environ['cloud_URI']
db_URI = os.environ['db_URI']
db_id = os.environ['db_id']
db_key = os.environ['db_key']
accounts_cont = os.environ['accounts_container']
filters_cont = os.environ['filters_container']
app_key = os.environ['APP_KEY']
connection_string = os.environ["COMMUNICATION_SERVICES_CONNECTION_STRING"]

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Inserting a user in progress....')
    #instantiate communicationservice
    comClient = CommunicationIdentityClient.from_connection_string(connection_string)

    client = cosmos.cosmos_client.CosmosClient(db_URI, db_key)
    db_client = client.get_database_client(db_id)
    accounts_container = db_client.get_container_client(accounts_cont)
    filters_container = db_client.get_container_client(filters_cont)
    
    message1 = {"result": True, "msg": "OK"}    
    message2 = {"result": False, "msg" : "User already exists"}
    message3 = {"result": False, "msg": "Password less than 8 characters or more than 24 characters"}
    message4 = {"result": False, "msg": "Username less than 4 characters or more than 16 characters"}
    message5 = {"result": False, "msg": "Email is already registered, please login"}
    message6 = {"result": False, "msg": "Invalid email address"}

    user = req.get_json()
    logging.info("Printing user ---------------------------------")
    logging.info(user)
    username = user['username']
    password = user['password']
    email = user['email']
    communicationID = comClient.create_user().properties['id']

    regex = re.compile(r"^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$" )

    #user input checks
    if (len(username) > 16 or len(username) < 4):
        return func.HttpResponse(body=json.dumps({"result": False, "message": message4}))

    elif (len(password) > 24 or len(password) < 8):
        return func.HttpResponse(body=json.dumps({"result": False, "message": message3}))

    elif (validEmail(regex, email) == False):
        return func.HttpResponse(body=json.dumps({"result": False, "message": message6}))

    elif True in (email == infoDB["email"] for infoDB in accounts_container.query_items('SELECT c.email FROM c WHERE c.email=\"' + email + '\"', enable_cross_partition_query=True)):
        return func.HttpResponse(body=json.dumps({"result": False, "message": message5}))

    else:
        logging.info("Successful checks, trying to add user to container")

    try:

        hashedPassword = bcrypt.hashpw(password.encode(), bcrypt.gensalt())   
        decodedPassword = hashedPassword.decode()
        
        userAccountinfo = {
        "id" : username, 
        "password" : password, 
        "email" : email, 
        "profile_pic_id": "",
        "phone": "",
        "bio": "",
        "hobbies": [],
        "age": "",
        "accepted": [],
        "rejected": [],
        "matched": [],
        "communicationID": communicationID}
        #Add user to accounts container
        accounts_container.create_item(userAccountinfo)

        userFilterinfo = {
        "id" : username, 
        "university" : "", 
        "course" : "", 
        "modules": [],
        "year": "",
        "language": "",
        "study_method": "",
        "study_time": ""}
        #Add user to filter container
        filters_container.create_item(userFilterinfo)

        return func.HttpResponse(body=json.dumps({"result": True, "accountData": userAccountinfo, "filterInfo": userFilterinfo}))
    except exceptions.CosmosHttpResponseError:
        return func.HttpResponse(body=json.dumps(message2))

def validEmail(regex, email):
    if re.fullmatch(regex, email):
        return True
    else:
        return False
