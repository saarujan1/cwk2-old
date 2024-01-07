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

# URI       updatefilters
# Input     {"username":, "password":} - may include {"university":, "year":, "course":, "modules": [], "language":, "study_method":, "study_time":}
# Outputs   {"result": False, "msg": "user does not exist"}, {"result": False, "msg": "wrong password"}, {"result": True}

def main(req: func.HttpRequest) -> func.HttpResponse:

    logging.info("Updating filters")
    
    #find if the user exists
    client = cosmos.cosmos_client.CosmosClient(db_URI, db_key)
    db_client = client.get_database_client(db_id)
    filters_container = db_client.get_container_client(filters_cont)
    accounts_container = db_client.get_container_client(accounts_cont)
    university_data_container = db_client.get_container_client(university_data_cont)

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

    #get filters
    userfilters = filters_container.read_item(item=pk,partition_key=pk)

    #check for Uni, year, course
    if("university" in user): userfilters.update({'university': user.get("university")})
    
    if("year" in user): userfilters.update({'year': user.get("year")})

    if("course" in user): 
        userfilters.update({'course': user.get("course")})

        if userfilters["university"] == "":
            resp = json.dumps({"result": False, "msg": "university must be set before course"})
            return func.HttpResponse(body=resp)

        unis = list(university_data_container.query_items(
        query='SELECT * FROM UniversityData a WHERE a.name = @uni',
        parameters=[{"name": "@uni", "value": userfilters["university"]}],
        enable_cross_partition_query=True,
        ))

        if len(unis) == 0:
            resp = json.dumps({"result": False, "msg": "invalid university name"})
            return func.HttpResponse(body=resp)

        uni = unis[0]

        found = False

        for course in uni["courses"]:
            if userfilters["course"] == course["name"]:
                found = True
                course["count"] += 1

        if not(found):
            uni["courses"].append({"name": userfilters["course"], "count": 1, "modules": []})

        university_data_container.upsert_item(uni)

    
    if("modules" in user): 
        userfilters.update({'modules': user.get("modules")})

        if userfilters["university"] == "" or userfilters["course"] == "":
            resp = json.dumps({"result": False, "msg": "university and course must be set before course"})
            return func.HttpResponse(body=resp)

        unis = list(university_data_container.query_items(
        query='SELECT * FROM UniversityData a WHERE a.name = @uni',
        parameters=[{"name": "@uni", "value": userfilters["university"]}],
        enable_cross_partition_query=True,
        ))

        if len(unis) == 0:
            resp = json.dumps({"result": False, "msg": "invalid university name"})
            return func.HttpResponse(body=resp)

        uni = unis[0]

        for course in uni["courses"]:
            if userfilters["course"] == course["name"]:
                for user_module in userfilters["modules"]:
                    found = False
                    for module in course["modules"]:
                        if user_module == module["name"]: 
                            found = True
                            module["count"] += 1
                    if not(found):
                        course["modules"].append({"name": user_module, "count": 1})

        university_data_container.upsert_item(uni)

    #check for language, study method and study time
    if("language" in user): userfilters.update({'language': user.get("language")})
    
    if("study_method" in user): userfilters.update({'study_method': user.get("study_method")})

    if("study_time" in user): userfilters.update({'study_time': user.get("study_time")})

    filters_container.upsert_item(userfilters)

    return func.HttpResponse(body=json.dumps({"result":True,"msg":"Success"}))
