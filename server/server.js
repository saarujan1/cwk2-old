'use strict'

import { CommunicationIdentityClient } from '@azure/communication-identity'
//connects to communcation resource
const connectionString = 'endpoint=https://cw2comser.communication.azure.com/;accesskey=EWDGv1/69aRUOoPYmCx76MGmKcIbwS/KVaNMWN10FM2bWn+OqinNzwZ8ExxqhqbTjMvnlOpSydixCot6HpfIXA=='
// Instantiate the identity client
const identityClient = new CommunicationIdentityClient(connectionString);

//Set up express
import express from 'express'
const app = express()

// routing variables
// import { homeRouter } from './routes/home.js'
import { logInRouter, handleLogin } from './routes/login.js'
import { newUserRouter } from './routes/newuser.js'
import { nextMatchRouter } from './routes/nextmatch.js'
import { nextUserRouter } from './routes/nextuser.js'
import { registerRouter, handleRegister } from './routes/register.js'


import rejects from 'assert'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'
import { Server } from 'socket.io'
import { dirname } from 'path'

//-------------- SERVER -------------- //
//Setup socket.io
const server = http.Server(app)
const io = new Server(server)

app.set('view engine', 'tsx')
//const cors = import('cors');  
//app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
// app.use('/static', express.static('public'))
const __filename = fileURLToPath(import.meta.url)
app.use(express.static(path.resolve(dirname(__filename), '../client/build')))
// app.use(express.static('../client/public'))
app.use(express.static(path.join(dirname(__filename), '../client/public')))

// app.get('/api', (req, res) => {
//   res.json({ message: 'Hello from server!' })
// })

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(dirname(__filename), '../client/build', 'index.html'))
// })

// app.use((req, res, next) => {
//   res.sendFile(path.join(dirname(__filename), '..', 'public'))
// })

// app.use((req, res, next) => {
//   res.redirect('/')
// const __filename = fileURLToPath(import.meta.url)
// res.sendFile(path.join(dirname(__filename), '..', 'public'))
// })

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
// app.get('/', homeRouter)
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
