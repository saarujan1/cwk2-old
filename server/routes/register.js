import { getAzure } from '../shared.js'
import { CommunicationIdentityClient } from '@azure/communication-identity'
//connects to communcation resource
const connectionString = 'endpoint=https://cw2comser.communication.azure.com/;accesskey=EWDGv1/69aRUOoPYmCx76MGmKcIbwS/KVaNMWN10FM2bWn+OqinNzwZ8ExxqhqbTjMvnlOpSydixCot6HpfIXA=='
// Instantiate the identity client - to create identities
const identityClient = new CommunicationIdentityClient(connectionString);

import express from 'express'
export const registerRouter = express.Router()

registerRouter.use((req, res, next) => {
  console.log(Date.now(), ': Calling the register API')
  next()
})

registerRouter.get('/register', function (req, res, next) {
  res.json({ message: "I'm registered" })
})

export async function handleRegister(message) {
  console.log('Handling register: ' + message)

  let path = '/api/register?'
  //add on commID
  /*let t = new Map(Object.entries(JSON.parse(message)));
  let cID = await createIdentity();
  t.set("communicationID",cID);
  message = JSON.stringify(Object.fromEntries(t))
  console.log(message);*/
  // Calls the Azure function to register a new user
  let promise = new Promise((resolve, reject) => getAzure(resolve, path, message))
  let resp = await promise

  if (resp.result == false) {
    console.log('Failed to register user')
    //socket.emit('failed auth', JSON.stringify({ msg: resp.msg }))
  } else {
    //addNewUser(socket, resp)
  }
}

//This func is for creating communication ID may need to be within backend function
async function createIdentity() {
  let identityResponse = await identityClient.createUser()
  console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`)
  return identityResponse.communicationUserId
}
