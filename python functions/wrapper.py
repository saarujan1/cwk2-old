"""
Wrapper File to test functions locally and deployed.

"""

import requests
APP_KEY="ICv8UmG9odsVgfA879OdhsW317Bt1rBy89gKgqeNEQhoAzFusfM-Mg=="
LOCAL_SERVER="http://localhost:7071/api/"
CLOUD_SERVER="https://unimatch.azurewebsites.net/api/"

def user_register(the_input,local=True):
  
    if local:
        prefix = LOCAL_SERVER 
    else:
        prefix = CLOUD_SERVER
         
    response = requests.post(prefix+'register', json=the_input, 
            headers={'x-functions-key' : APP_KEY })
    output = response.json()
    return output

def user_login(the_input,local=True):

    if local:
        prefix = LOCAL_SERVER 
    else:
        prefix = CLOUD_SERVER
    response = requests.post(prefix+'login', json=the_input, 
            headers={'x-functions-key' : APP_KEY })
    output = response.json()
    return output

def user_request(the_input,local=True):

    if local:
        prefix = LOCAL_SERVER 
    else:
        prefix = CLOUD_SERVER
    response = requests.post(prefix+'request', json=the_input, 
            headers={'x-functions-key' : APP_KEY })
    output = response.json()
    return output


def user_request(the_input,local=True):

    if local:
        prefix = LOCAL_SERVER 
    else:
        prefix = CLOUD_SERVER
    response = requests.post(prefix+'getAccount', json=the_input, 
            headers={'x-functions-key' : APP_KEY })
    output = response.json()
    return output

def updateAccount(the_input,local=True):

    if local:
        prefix = LOCAL_SERVER 
    else:
        prefix = CLOUD_SERVER
    response = requests.post(prefix+'updateAccount', json=the_input, 
            headers={'x-functions-key' : APP_KEY })
    output = response.json()
    return output

def updateFilters(the_input,local=True):

    if local:
        prefix = LOCAL_SERVER 
    else:
        prefix = CLOUD_SERVER
    response = requests.post(prefix+'updateFilters', json=the_input, 
            headers={'x-functions-key' : APP_KEY })
    output = response.json()
    return output

def tests():

    print("~~~~~~~~~~~~~~~~~~~~ Login ~~~~~~~~~~~~~~~~~~~~")

    print("----------------- ok -----------------")
    print(updateFilters(
        {"username": "encrypt4", "password": "encryptPass", "university": "fakeUni", "course": "fakeCourse", "year": "fakeEverything"},
        True))

    print(updateFilters(
        {"username": "encrypt4", "password": "encrysptPass", "university": "fakeUni", "course": "fakeCourse", "year": "fakeEverything"},
        True))




    # print(user_register(
    #     {
    #     "username" : "encrypt4", 
    #     "password": "encryptPass",
    #     "email": "testencrypt4@gmail.com",
    #      },
    #     True))

    # print(user_request(
    # {
    # "id" : "encrypt4", 
    # "password": "encryptPass",
    # },
    # True))

    # print(user_request(
    # {
    # "id" : "encrypt4", 
    # "password": "encryptdPass",
    # },
    # True))

    # print(user_request(
    # {
    # "id" : "encrypt4", 
    # "password": "encrypdtPass",
    # },
    # True))

    
if __name__ == '__main__':
    tests()
      
