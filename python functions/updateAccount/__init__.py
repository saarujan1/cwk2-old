import json
import logging

import azure.functions as func
import azure.cosmos as cosmos
import azure.cosmos.exceptions as exceptions
import re

#import config
#cloud_URI = config.settings['cloud_URI']
#db_URI = config.settings['db_URI']
#db_id = config.settings['db_id']
#db_key = config.settings['db_key']
#accounts_cont = config.settings['accounts_container']
#filters_cont = config.settings['filters_container']
#app_key = config.settings['APP_KEY']

import os
cloud_URI = os.environ['cloud_URI']
db_URI = os.environ['db_URI']
db_id = os.environ['db_id']
db_key = os.environ['db_key']
accounts_cont = os.environ['accounts_container']
filters_cont = os.environ['filters_container']
app_key = os.environ['APP_KEY']

def main(req: func.HttpRequest) -> func.HttpResponse:
    
    # example input - {"username":"","password":""} #can include email, phonenumber, profilepicID, bio and hobbies, age and commID to update
    # example return - {result: True, msg: 'Okay'}

    #find if the user exists
    client = cosmos.cosmos_client.CosmosClient(db_URI, db_key)
    db_client = client.get_database_client(db_id)
    accounts_container = db_client.get_container_client(accounts_cont)

    #Validation
    user = req.get_json()
    username = user['username']
    password = user['password']

    try: #successfully read the player
        pk = username
        useraccount = accounts_container.read_item(item=pk, partition_key=pk)        
    except: #player doesnt exist
   
        resp = json.dumps({"result": False, "msg": "user does not exist" })
        return func.HttpResponse(body=resp)

    #has correct password
    if(useraccount['password'] != password):
        resp = json.dumps({"result": False, "msg": "wrong password" })
        return func.HttpResponse(body=resp)

    #check for email, pp, phone, bio and hobbies
    if("email" in req.get_json()): useraccount.update({'email': req.get_json().get("email")})

    #check if its a valid phone number
    if("phone" in req.get_json()):
        if(validatePhoneNumber(req.get_json().get("phone"))):
            useraccount.update({'phone': req.get_json().get("phone")})
        else:
            return func.HttpResponse(body=json.dumps({"result" : False, "msg": "Invalid Phone Number" }))

    if("bio" in req.get_json()): useraccount.update({'bio': req.get_json().get("bio")})
    if("hobbies" in req.get_json()): useraccount.update({'hobbies': req.get_json().get("hobbies")})
    if("age" in req.get_json()): 
        
        age = req.get_json().get("age")
        if (age.isnumeric() and int(age) > 0):
            useraccount.update({'age': age})
        else:
            return func.HttpResponse(body=json.dumps({"result" : False, "msg": "Invalid age" }))

    if("communicationID" in req.get_json()): useraccount.update({'communicationID': req.get_json().get("communicationID")})

    try:
        accounts_container.upsert_item(body=useraccount)
        return func.HttpResponse(body=json.dumps({"result" : True, "msg": "OK" }))
    except:
        return func.HttpResponse(body=json.dumps({"result" : False, "msg": "Failed to update" }))
    
    

def validatePhoneNumber(inputNumber):#regex for valid phone number
    ukphoneRegex = r'^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$'
    inputNumber = inputNumber.replace(" ","")
    return bool(re.match(ukphoneRegex, inputNumber))
