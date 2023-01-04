import { usersToMatches, usersToSockets, socketsToUsers, users } from '../shared.js'
import express from 'express'
export const newUserRouter = express.Router()

newUserRouter.use((req, res, next) => {
  console.log(Date.now(), ': Routing to newuser')
  next()
})

newUserRouter.get('/newuser', function (req, res, next) {
  res.json({ message: 'new user.' })
})

export function addNewUser(socket, resp) {
  clientState = { stateNum: 1 }
  users.push({ accountData: resp.accountData, filterInfo: resp.filterInfo, clientState: clientState })

  usersToSockets.set(resp.accountData.id, socket)
  socketsToUsers.set(socket, resp.accountData.id)
  usersToMatches.set(resp.accountData.id, new Array())

  socket.emit('set account', JSON.stringify(accountData))
  socket.emit('set filters', JSON.stringify(filterInfo))
  socket.emit('set state', JSON.stringify(clientState))
}
