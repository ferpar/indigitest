const makeUserDb = require('./userdb')
const db = require('../index')

const userDb = makeUserDb({ db })

module.exports = userDb
