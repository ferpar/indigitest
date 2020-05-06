const express = require('express')
const bodyParser = require('body-parser')
/// use actual endpointhandlers initializes with postgres db
const handleUserRequest = require('./controllers/user-endpoint')
const handleFriendRequest = require('./controllers/friend-endpoint')
// const { handleUserRequest, handleFriendRequest } = require('./controllers')
/////
const adaptRequest = require('./helpers/adaptRequest')
const dbtest = require('./db')

const server = express()
server.use(bodyParser.json())

dbtest.query('SELECT * FROM users2', (err, res) => {
  if (err) {
    console.error('error reading users table', err)
  }
  console.log(res.rows[0])
} )

function usersController (req, res) {
  console.log('httpRequest: ' + req.method + ' ' + req.path  )
  const httpRequest = adaptRequest(req)
  handleUserRequest(httpRequest)
    .then(({ headers, statusCode, data = {} }) => {
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
      res
        .set(headers)
        .status(statusCode)
        .send(data)
    })
    .catch(err => res.status(500).end())
}

server.listen(9090, () => console.log('listening on port 9090'))

