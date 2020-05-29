const { Pool } = require('pg')
const dbConfig = require('./config.json')

const pool = new Pool({...dbConfig.poolData})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
  connect: () => pool.connect(),
  shutdown: () => pool.end()
}
