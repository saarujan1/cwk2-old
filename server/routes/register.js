import { getAzure } from '../shared.js'

import express from 'express'
export const registerRouter = express.Router()

registerRouter.use((req, res, next) => {
  console.log(Date.now(), ': Calling the register API')
  next()
})

registerRouter.get('/register', function (req, res, next) {
  res.json({ message: "I'm registered" })
})

export async function handleRegister(socket, message) {
  console.log('Handling register: ' + message)

  let path = '/api/register?'

  message = JSON.stringify('communicationID', createIdentity())
  // Calls the Azure function to register a new user
  let promise = new Promise((resolve, reject) => getAzure(resolve, path, message))
  let resp = await promise

  if (resp.result == false) {
    console.log('Failed to register user')
    socket.emit('failed auth', JSON.stringify({ msg: resp.msg }))
  } else {
    addNewUser(socket, resp)
  }
}

//This func is for creating communication ID may need to be within backend function
async function createIdentity() {
  let identityResponse = await identityClient.createUser()
  console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`)
  return identityResponse.communicationUserId
}
