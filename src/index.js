const express = require('express')
const bodyParser = require('body-parser')
const adaptRequest = require('./helpers/adaptRequest')

const { handleUserRequest, handleFriendRequest } = require('./controllers')
const usersEndpoint = makeEndpointCallback(handleUserRequest);
const friendsEndpoint = makeEndpointCallback(handleFriendRequest);


const server = express()
server.use(bodyParser.json())

server.all('/user', usersEndpoint)
server.get('/user/:id', usersEndpoint)
server.delete('/user/:id', usersEndpoint)

server.all('/friend', friendsEndpoint)
server.get('/friend/:type/:id', friendsEndpoint)


function makeEndpointCallback (controller) {
  return function (req, res) {
    console.log('httpRequest: ' + req.method + ' ' + req.path  )
    const httpRequest = adaptRequest(req)
    controller(httpRequest)
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
}


server.listen(9090, () => console.log('listening on port 9090'))

