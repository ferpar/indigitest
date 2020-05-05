const makeHttpError = require('../helpers/httpError')
const makeUser = require('.')
const unpackUser = require('../helpers/unpack')

function makeUsersEndpointHandler({ userActions }) {
  return function handle (httpRequest) {
    switch (httpRequest.method){
      case 'POST':
        return postUser(httpRequest)
      case 'GET':
        return getUser(httpRequest)
      case 'PATCH':
        return updateUser(httpRequest)
      default:
        return makeHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} not allowed`
        })
    }
  }
  async function postUser(httpRequest){
    const userInfo = JSON.parse(httpRequest.body)
    try {
      userActions.create(makeUser(userInfo))
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 201
      }
    } catch (err) {
      console.error('[user endpoint handler] Error posting user', err)
      return makeHttpError({
        error: err.message,
        statusCode: 500
      })
    }
  }
  async function getUser(httpRequest){
    const id = httpRequest.pathParams
    try {
      const result = await userActions.getById(id)
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 201,
        data: unpackUser(result)
      }
    } catch (err) {
      console.error('[user endpoint handler] Error getting user', err)
      return makeHttpError({
        error: err.message,
        statusCode: 500
      })
    }
  }
  async function updateUser(httpRequest){
    const userInfo = JSON.parse(httpRequest.body)
    try{
      await userActions.update(makeUser(userInfo))  
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
      }
    } catch (err) {
      console.error('[user endpoint handler] Error posting user', err)
      return makeHttpError({
        error: err.message,
        statusCode: 500
      })
    }
  }
}

module.exports = makeUsersEndpointHandler
