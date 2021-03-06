const express = require('express')
const bodyParser = require('body-parser')
const { userRequestHandler, friendRequestHandler } = require('./controllers')
const makeExpressCallback = require('./helpers/expressCallback')

const usersEndpoint = makeExpressCallback(userRequestHandler);
const friendsEndpoint = makeExpressCallback(friendRequestHandler);


const server = express()
server.use(bodyParser.json())

server.all('/user', usersEndpoint)
server.get('/user/:id', usersEndpoint)
server.put('/user/:id', usersEndpoint)
server.delete('/user/:id', usersEndpoint)

server.all('/friend', friendsEndpoint)
server.post('/friend/remove', friendsEndpoint)
server.get('/friend/:type/:id', friendsEndpoint)

module.exports = server;
