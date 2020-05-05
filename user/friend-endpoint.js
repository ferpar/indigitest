const makeHttpError = require('../helpers/httpError')
const makeUser = require('.')
const unpackUser = require('../helpers/unpack')

function makeFriendsEndpointHandler({ userActions }) {
  return function handle (httpRequest) {
    switch(httpRequest.method) {
      default:
        return makeHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} not allowed`
        })
    } 
  } 
}

module.exports = makeFriendsEndpointHandler
