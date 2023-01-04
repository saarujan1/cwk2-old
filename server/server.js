'use strict'

//Set up express
import express from 'express'
const app = express()

// routing variables
import { homeRouter } from './routes/home.js'
import { logInRouter, handleLogin } from './routes/login.js'
import { newUserRouter } from './routes/newuser.js'
import { nextMatchRouter } from './routes/nextmatch.js'
import { nextUserRouter } from './routes/nextuser.js'
import { registerRouter } from './routes/register.js'

import rejects from 'assert'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'
import { Server } from 'socket.io'

//-------------- SERVER -------------- //
//Setup socket.io
const server = http.Server(app)
const io = new Server(server)

app.set('view engine', 'tsx')
app.use('/static', express.static('public'))

function startServer() {
  const PORT = process.env.PORT || 8080
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}

function newConnection(socket) {
  console.log('New connection on socket: ' + socket.id + ' index: ' + nextPlayerNum)
  nextPlayerNum++
}

async function handleTokenRequest(comID) {
  // Issue an access token with a validity of 24 hours and the "chat" scope for an identity
  let tokenResponse = await identityClient.getToken(comID, ['chat'])
  let { token, expiresOn } = tokenResponse
  console.log(`\nIssued an access token with 'chat' scope that expires at ${expiresOn}:`)
  console.log(token)
  socket.emit('token', token)
}

//-------------- ROUTING -------------- //
//Handle client interface on /
app.get('/', homeRouter)
app.get('/register', registerRouter)
app.get('/login', logInRouter)
app.get('/newuser', newUserRouter)
app.get('/nextmatch', nextMatchRouter)
app.get('/nextuser', nextUserRouter)

//-------------- CONNECTION BETWEEN SERVER AND CLIENT -------------- //
//Handle new connections from the client
io.on('connection', (socket) => {
  newConnection(socket)

  socket.on('register', (message) => {
    handleRegister(socket, message)
  })

  socket.on('login', (message) => {
    handleLogin(socket, message)
  })

  socket.on('next match', (message) => {
    handleNextMatch(socket, message)
  })

  //handle communication token request
  socket.on('token', (communicationID) => {
    handleTokenRequest(communicationID)
  })

  //Handle disconnection
  socket.on('disconnect', () => {
    console.log('Dropped connection')
  })
})

//Start server
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer()
}
