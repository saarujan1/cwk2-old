import {getAzure, usersToMatches } from '../shared.js'
import {getNext} from './nextuser.js'
import express from 'express'
export const nextMatchRouter = express.Router()

nextMatchRouter.use((req, res, next) => {
  console.log(Date.now(), ': Calling the nextmatch API')
  next()
})

nextMatchRouter.get('/nextmatch', function (req, res, next) {
  res.json({ message: 'next match' })
})

export async function handleNextMatch(socket, message) {

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

function getID(socket) {
  return socketsToUsers.get(socket)
}