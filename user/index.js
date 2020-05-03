const sanitizeHtml = require('sanitize-html')
const Id = require('../Id')
const buildMakeUser = require('./user')

function sanitize (text) {
  return sanitizeHtml(text,{
    allowedTags: [],
    allowedAttributes: {}
  })
}

const makeUser = buildMakeUser({ Id, sanitize })

module.exports = makeUser
