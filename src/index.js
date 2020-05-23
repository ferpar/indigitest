const express = require('express')
const bodyParser = require('body-parser')
const adaptRequest = require('./helpers/adaptRequest')

const handleUserRequest = require('./controllers').handleUserRequest;
const handleFriendRequest = require('./controllers').handleFriendRequest;

const server = express()
server.use(bodyParser.json())

server.all('/user', usersController)
server.get('/user/:id', usersController)
server.delete('/user/:id', usersController)

server.all('/friend', friendsController)
server.get('/friend/:type/:id', friendsController)

function usersController (req, res) {
  console.log('httpRequest: ' + req.method + ' ' + req.path  )
  const httpRequest = adaptRequest(req)
  handleUserRequest(httpRequest)
    .then(({ headers, statusCode, data = {} }) => {
      console.log(statusCode)
      console.log(data)
      res
        .set(headers)
        .status(statusCode)
        .send(data)
    })
    .catch(err => res.status(500).end())
}

function friendsController (req, res) {
  console.log('httpRequest: ' + req.method + ' ' + req.path  )
  const httpRequest = adaptRequest(req)
  handleFriendRequest(httpRequest)
    .then(({ headers, statusCode, data = {} }) => {
      console.log(statusCode)
      console.log(data)
      res
        .set(headers)
        .status(statusCode)
        .send(data)
    })
    .catch(err => res.status(500).end())
}

server.listen(9090, () => console.log('listening on port 9090'))

