//Set up express
import { getAzure } from '../shared.js'

import express from 'express'
export const logInRouter = express.Router()

logInRouter.use((req, res, next) => {
  console.log(Date.now(), ': Calling the login API')
  next()
})

logInRouter.get('/login', function (req, res, next) {
  res.json({ message: "I'm logged in" })
})

export async function handleLogin(socket, message) {
  console.log('Handling login: ' + message)

  let path = '/api/login?'

  // Calls the Azure function to login a user
  let promise = new Promise((resolve, reject) => getAzure(resolve, path, message))
  let resp = await promise

  if (resp.result == false) {
    console.log('Failed to login user')
    socket.emit('failed auth', JSON.stringify({ msg: resp.msg }))
  } else {
    addNewUser(socket, resp)
  }
}
