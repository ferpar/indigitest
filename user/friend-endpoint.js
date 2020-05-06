const makeHttpError = require('../helpers/httpError')
const makeUser = require('.')
const unpackUser = require('../helpers/unpack')

function makeFriendsEndpointHandler({ userActions }) {
  return function handle (httpRequest) {
    switch(httpRequest.method) {
      case 'POST':
        return postFriendship(httpRequest)
      case 'GET':
        return getFriendship(httpRequest)
      case 'DELETE':
        return deleteFriendship(httpRequest)
      default:
        return makeHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} not allowed`
        })
    } 
  } 
  async function postFriendship(httpRequest){
    const { id1, id2 } = JSON.parse(httpRequest.body)
    try {
      userActions.addFriendship(id1, id2)
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 201
      }
    } catch (err) {
      if (err.message === 'Friendship already exists') {
        return makeHttpError({
          error: err.message,
          statusCode: 409
        })
      } else if (err.message === 'Both ids are needed for establishing a friendship'){
        return makeHttpError({
          error: err.message,
          statusCode: 422
        })
      } else {
        console.error('[friend endpoint handler] Error posting friendship', err)
        return makeHttpError({
          error: err.message,
          statusCode: 500
        })
      }
    }
  }
  async function getFriendship(httpRequest){
    const { type, id } = httpRequest.pathParams
    try {
      const result = (type === 'list') 
        ? await userActions.getFriends(id)
        : await userActions.friendCount(id)
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: type === 'list' 
          ? {friends: result}
          : {friendCount: result}
      }
    } catch (err) {
      if (err.message === 'User not found'){
        return makeHttpError({
          error: err.message,
          statusCode: 404
        })
      } else {
        console.error('[friend endpoint handler] Error getting user friendships', err)
        return makeHttpError({
          error: err.message,
          statusCode: 500
        })
      }
    }
  }
  async function deleteFriendship(httpRequest){
    const { id1, id2 } = JSON.parse(httpRequest.body)
    try {
      await userActions.removeFriendship(id1, id2)
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200
      }
    } catch (err) {
      if (err.message === 'Both ids are needed to remove a friendship'){
        return makeHttpError({
          error: err.message,
          statusCode: 422
        })
      } else {
        console.error('[friend endpoint handler] Error removing friendship', err)
        return makeHttpError({
          error: err.message,
          statusCode: 500
        })
      }
    }
  }
}

module.exports = makeFriendsEndpointHandler
