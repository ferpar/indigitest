const makeHttpError = require('./aux/httpError')
const isSouthOrNorth = require('./aux/isSouthOrNorth')
const processSouthern = require('./aux/processSouthern')

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
      let storedUser
      if (await isSouthOrNorth( 
        userInfo.latitude || userInfo.source.latitude, 
        userInfo.longitude || userInfo.source.longitude
      ) === "S") {
        storedUser = await processSouthern() 
      } else {
        storedUser = await userActions.create(userInfo)
      }
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 201,
        data: storedUser ? {
          id: storedUser.getId(),
          username: storedUser.getUsername()
        } : false
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
    try {
      const { id } = httpRequest.pathParams
      const result = await userActions.getById(id)

      if (!result) {
        return makeHttpError({
          error: 'User not found',
          statusCode: 404
        })
      }

      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 201,
        data: result.getUser()
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
    try{
      const userInfo = httpRequest.body
      const result = await userActions.update(userInfo)  
      if (!result) {
        return makeHttpError({
          error: 'User not found',
          statusCode: 404
        })
      }
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: result.getUser()
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
      const removed = await userActions.remove(id)
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: removed ? 200 : 204,
        data: {removeCount: removed}
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
