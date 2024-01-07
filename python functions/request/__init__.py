import json
import logging
import azure.functions as func
import azure.cosmos as cosmos
import azure.cosmos.exceptions as exceptions
import re

# import config
# cloud_URI = config.settings['cloud_URI']
# db_URI = config.settings['db_URI']
# db_id = config.settings['db_id']
# db_key = config.settings['db_key']
# accounts_cont = config.settings['accounts_container']
# filters_cont = config.settings['filters_container']
# app_key = config.settings['APP_KEY']

import os
cloud_URI = os.environ['cloud_URI']
db_URI = os.environ['db_URI']
db_id = os.environ['db_id']
db_key = os.environ['db_key']
accounts_cont = os.environ['accounts_container']
filters_cont = os.environ['filters_container']
app_key = os.environ['APP_KEY']

def main(req: func.HttpRequest) -> func.HttpResponse:
    

    client = cosmos.cosmos_client.CosmosClient(db_URI, db_key)
    db_client = client.get_database_client(db_id)
    accounts_container = db_client.get_container_client(accounts_cont)
    filters_container = db_client.get_container_client(filters_cont)

    message1 = {"result": False , "msg": "User does not exist"}  

    user = req.get_json()
    noOfUsers = int(user['n'])
    id = user['id']
    
    logging.info('Getting ' + str(noOfUsers) + ' matching users')

    #get the filters that the user has 
    user_filter = list(filters_container.query_items(
        query='SELECT * FROM Filters f WHERE f.id = @id',
        parameters=[{"name": "@id", "value": id}],
        enable_cross_partition_query=True,
    ))[0]

    #get user data for Accepted/rejectList
    userData = accounts_container.read_item(item=id, partition_key=id)   
    accepted = userData['accepted']
    rejected = userData['rejected']
    allcantUse = accepted + rejected + [id]

    #get all other user's filters 
    others_filters = list(filters_container.query_items(
        query='SELECT * FROM Filters f', # WHERE f.university = @uni',
        # parameters=[{"name": "@uni", "value": user_filter["university"]}],
        enable_cross_partition_query=True,
    ))

    #strip off Rejected and accepted users
    j = 0
    while j < len(others_filters):
        for cantUse in allcantUse:
            if others_filters[j]['id'] == cantUse:
                others_filters.pop(j)
                j-=1
                break
        j += 1

    fitnesses = []
    weights = {}

    for key in user_filter.keys():
        if(key == "university"):
            weights[key] = 100
        elif(key == "course"):
            weights[key] = 30
        elif(key == "modules"):
            weights[key] = 5    # weight per matching module        
        elif(key == "year"):
            weights[key] = 25
        elif(key == "language"):
            weights[key] = 50
        elif(key == "study_method"):
            weights[key] = 15
        elif(key == "study_time"):
            weights[key] = 15
        else:
            print("Unknown filter")

    #get fitness for each other user -> put in a map (id -> fitness)
    for i in range(len(others_filters)):
        fitnesses.append((others_filters[i]['id'], getFitness(user_filter, others_filters[i], weights)))

    logging.info("fitnesses: " + str(fitnesses))

    logging.info
    #sort by fitness
    fitnesses = sorted(fitnesses, key=lambda d: d[1], reverse=True) 
    fitnesses = fitnesses[:noOfUsers]


    ids = [i[0] for i in fitnesses]

    logging.info("ids: " + str(ids))
    #return top N other users
    
    try:
        return func.HttpResponse(body=json.dumps({'result':True,'ids': ids}))
    except exceptions.CosmosHttpResponseError:
        return func.HttpResponse(body=json.dumps(message1))

def getFitness(user_filters, matching_filters, weights):

    # Compare all the filters 
    if user_filters['university'] != matching_filters['university']:
        return 0
    
    fitness = 0

    for filter_key in weights.keys():

        if filter_key == "modules":
            comparison = sum([int(matching_modules == user_modules) for matching_modules in matching_filters[filter_key] 
                                                                    for user_modules in user_filters[filter_key]])
        else:
            comparison = int(user_filters[filter_key] == matching_filters[filter_key])
        fitness += weights[filter_key] * comparison

    return fitness
    