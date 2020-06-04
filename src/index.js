require('./env.js')

const server = require('./app')

server.listen( process.env.PORT || 9090, () => console.log(`listening on port ${process.env.PORT || 9090}`))

