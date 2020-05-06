const express = require('express')
const bodyParser = require('body-parser')

const server = express()
server.use(bodyParser.json())

server.listen(9090, () => console.log('listening on port 9090'))

