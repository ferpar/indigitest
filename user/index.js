const Id = require('../Id')
const buildMakeUser = require('./user')

const makeUser = buildMakeUser({ Id })

module.exports = makeUser
