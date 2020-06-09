require('./env.js')

const app = require('./app')

const server = app.listen( process.env.PORT || 9090, () => console.log(`listening on port ${process.env.PORT || 9090}`))

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated')
  })
})

module.exports = server
