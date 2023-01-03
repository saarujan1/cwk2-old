// Proposed message format from client
//
// All messages between client and server should be stringified JSONs
// CLIENT -> SERVER messages
// 'register' - {"username": , "password": , "email": } - returns 'failed auth' or ('set account' and 'set filters' and 'set state')
// 'login' - {"username": , "password"} - returns 'failed auth' or ('set account' and 'set filters' and 'set state')
// 'next match' - {} - returns a message in form of 'set next match'
//
//
// SERVER -> CLIENT messages
// 'failed auth' - {"msg": }    this one is optional if frontend want the reason you can't register / login
// 'set account' - {"id": , "password": , "email": , "profile_pic_id": , "phone": , "bio": , "hobbies": [], 
//                  "accepted": [], "rejected": []}
// 'set filters' - {"id": , "university": , "course": , "year": , "language": , "study_method": , "study_time": }
// 'set state' - {"stateNum": int} - 1 - logged in
// 'set next match' - {"id": , "profile_pic_id": , "bio": , "hobbies": []}


'use strict';

const { CommunicationIdentityClient } = require('@azure/communication-identity');
//connects to communcation resource
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
// Instantiate the identity client
const identityClient = new CommunicationIdentityClient(connectionString);

const { rejects } = require('assert');
//Set up express
const express = require('express');
const app = express();

// Setup http requests
var http = require('https');
const { resolve } = require('path');
const request = require('request');

//Setup socket.io
const server = require('http').Server(app);
const io = require('socket.io')(server);

// TODO change this to work with React.js -- Maybe change to tsx -- MAY NEED TO CHANGE SERVER TO JSX
//Setup static page handling
app.set('view engine', 'ejs');
app.use('/static', express.static('public'));


let usersToSockets = new Map();
let socketsToUsers = new Map();
let usersToMatches = new Map();

let users = new Array();

//Handle client interface on /
app.get('/', (req, res) => {
  res.render('client');
});

//Start the server
function startServer() {
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

function newConnection (socket) {

  console.log('New connection on socket: ' + socket.id + " index: " + nextPlayerNum);

  nextPlayerNum++;

}

async function handleRegister(socket, message) {
  
  console.log('Handling register: ' + message); 

  let path = '/api/register?';

  message = JSON.stringify('communicationID',createIdentity());
  // Calls the Azure function to register a new user
  let promise = new Promise((resolve, reject) => getAzure(resolve, path, message));
  let resp = await promise;

  if (resp.result == false) {

    console.log("Failed to register user");
    socket.emit("failed auth", JSON.stringify({"msg" :resp.msg}));

  } else {

    addNewUser(socket, resp);

  }

}

async function handleLogin(socket, message) {
  
  console.log('Handling login: ' + message); 

  let path = '/api/login?';

  // Calls the Azure function to login a user
  let promise = new Promise((resolve, reject) => getAzure(resolve, path, message));
  let resp = await promise;

  if (resp.result == false) {

    console.log("Failed to login user");
    socket.emit("failed auth", JSON.stringify({"msg" :resp.msg}));

  } else {

    addNewUser(socket, resp);

  }

}

function addNewUser(socket, resp){

  clientState = {"stateNum": 1}
  users.push({"accountData": resp.accountData, "filterInfo": resp.filterInfo, "clientState": clientState})
  
  usersToSockets.set(resp.accountData.id, socket);
  socketsToUsers.set(socket, resp.accountData.id);
  usersToMatches.set(resp.accountData.id, new Array());

  socket.emit('set account', JSON.stringify(accountData));
  socket.emit('set filters', JSON.stringify(filterInfo));
  socket.emit('set state', JSON.stringify(clientState));

}

async function handleNextMatch(socket, message){

  console.log('Handling get next match : ' + message); 

  let id = getID(socket);

  // if there are no matches stored on the server then a request is made for 10 more from the DB
  if(usersToMatches(id).length > 0){

    getNext(id);

  } else {

    let path = '/api/request?';

    message = JSON.stringify({"id": id, "n": 10});

    let promise = new Promise((resolve, reject) => getAzure(resolve, path, message));
    let resp = await promise;

    usersToMatches(id) = resp.ids;
    getNext(id);

  }

}

async function getNext(id){

  let match = usersToMatches(id).shift();

  path = '/api/getAccount?';

  message = JSON.stringify({"id": match})

  promise = new Promise((resolve, reject) => getAzure(resolve, path, message));
  resp = await promise;

  if (resp.result == false) {

    console.log("Failed to get next account");

  } else {

    let account = removeSensitive(resp.account);

    socket.emit('set next match', JSON.stringify(account));

  }

}

//This func is for creating communication ID may need to be within backend function
async function createIdentity(){
  let identityResponse = await identityClient.createUser();
  console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);
  return identityResponse.communicationUserId;
}

function removeSensitive(account){

  delete account.password;
  delete account.email;
  delete account.phone;
  delete account.accepted;
  delete account.rejected;
  delete account._rid;
  delete account._self;
  delete account._etag;
  delete account._attachments;
  delete account._ts;

  return account;

}



// Makes a call to an Azure function with a given path and JSON input, and returns the response

function getAzure(resolve, path, strjson){

  let url = 'https://unimatch.azurewebsites.net' + path + 'code=ICv8UmG9odsVgfA879OdhsW317Bt1rBy89gKgqeNEQhoAzFusfM-Mg==';

  request.post(

      url,
      { json: strjson },

      function (error, response, body) {

          if (!error && response.statusCode == 200) {

              console.log("Response Body: " + JSON.stringify(body));
              resolve(JSON.parse(JSON.stringify(body)));

          } else {

              console.log(error);
              console.log(response.statusCode);
              resolve({"result": false});

          }

      }

  );

}
async function handleTokenRequest(comID){
  // Issue an access token with a validity of 24 hours and the "chat" scope for an identity
  let tokenResponse = await identityClient.getToken(comID, ["chat"]);
  let { token, expiresOn } = tokenResponse;
  console.log(`\nIssued an access token with 'chat' scope that expires at ${expiresOn}:`);
  console.log(token);
  socket.emit('token',token)
}

function getID(socket){

  return socketsToUsers.get(socket);

}

//Handle new connection
io.on('connection', socket => { 

  newConnection(socket)

  socket.on('register', message => {
    handleRegister(socket, message);
  });

  socket.on('login', message => {
    handleLogin(socket, message);
  })

  socket.on('next match', message => {
    handleNextMatch(socket, message);
  })

  //handle communication token request
  socket.on('token', (communicationID) => {
    handleTokenRequest(communicationID);
  });

  
  

  //Handle disconnection
  socket.on('disconnect', () => {
    console.log('Dropped connection');
  });
  
});

//Start server
if (module === require.main) {
  startServer();
}

module.exports = server;
