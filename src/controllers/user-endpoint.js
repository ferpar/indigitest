const makeHttpError = require('../helpers/httpError')
const isSouthOrNorth = require('../helpers/isSouthOrNorth')
const processSouthern = require('../helpers/processSouthern')

function makeUsersEndpointHandler({ userActions }) {
  return function handle (httpRequest) {
    switch (httpRequest.method){
      case 'POST':
        return postUser(httpRequest)
      case 'GET':
        return getUser(httpRequest)
      case 'PATCH':
        return updateUser(httpRequest)
      case 'DELETE':
        return removeUser(httpRequest)
      default:
        return makeHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} not allowed`
        })
    }
  }
  async function postUser(httpRequest){
    try {
      const userInfo = httpRequest.body
      if (await isSouthOrNorth( 
        userInfo.latitude || userInfo.source.latitude, 
        userInfo.longitude || userInfo.source.longitude
      ) === "S") {
        await processSouthern() 
      } else {
        await userActions.create(userInfo)
      }
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 201
      }
    } catch (err) {
      if (err.message === 'Conflict: User already created') {
        return makeHttpError({
          error: err.message,
          statusCode: 409
        })
      } else {
        console.error('[user endpoint handler] Error posting user', err)
        return makeHttpError({
          error: err.message,
          statusCode: 500
        })
      }
    }
  }
  async function getUser(httpRequest){
    try {
      const { id } = httpRequest.pathParams
      const result = await userActions.getById(id)
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 201,
        data: result.getUser()
      }
    } catch (err) {
      if (err.message === 'User not found') {
        return makeHttpError({
          error: err.message,
          statusCode: 404
        })
      } else {
        console.error('[user endpoint handler] Error getting user', err)
        return makeHttpError({
          error: err.message,
          statusCode: 500
        })
      }
    }
  }
  async function updateUser(httpRequest){
    try{
      const userInfo = JSON.parse(JSON.stringify(httpRequest.body))
      await userActions.update(userInfo)  
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
  async function removeUser(httpRequest){
    try {
    const { id } = httpRequest.pathParams
      await userActions.remove(id)
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
      }
    } catch (err) {
      if (err.message === 'User not found'){
        return makeHttpError({
          error: err.message,
          statusCode: 404
        })
      } else {
        console.error('[user endpoint handler] Error removing user', err)
        return makeHttpError({
          error: err.message,
          statusCode: 500
        })
      }
    }
  }
}

module.exports = makeUsersEndpointHandler
