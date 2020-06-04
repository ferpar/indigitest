const { Pool } = require('pg')
const env = process.env.NODE_ENV || 'development'
const dbConfig = require(`./${env}.json`)

const pool = new Pool({...dbConfig.poolData})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
  shutdown: () => pool.end()
}
