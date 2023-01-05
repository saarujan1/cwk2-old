import { getAzure, usersToMatches } from '../shared.js'

import express from 'express'
export const nextUserRouter = express.Router()

nextUserRouter.use((req, res, next) => {
  console.log(Date.now(), ': Calling the nextuser API')
  next()
})

nextUserRouter.get('/nextuser', function (req, res, next) {
  res.json({ message: 'next user' })
})

export async function getNext(id) {
  let match = usersToMatches(id).shift()

  path = '/api/getAccount?'

  message = JSON.stringify({ id: match })

  promise = new Promise((resolve, reject) => getAzure(resolve, path, message))
  resp = await promise

  if (resp.result == false) {
    console.log('Failed to get next account')
  } else {
    let account = removeSensitive(resp.account)

    socket.emit('set next match', JSON.stringify(account))
  }
}

function removeSensitive(account) {
  delete account.password
  delete account.email
  delete account.phone
  delete account.accepted
  delete account.rejected
  delete account._rid
  delete account._self
  delete account._etag
  delete account._attachments
  delete account._ts

  return account
}
