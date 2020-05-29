const makeHttpError = require('./aux/httpError')

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
    try {
      const { id1, id2 } = JSON.parse(JSON.stringify(httpRequest.body))
      const newFriendship = await userActions.addFriendship(id1, id2)
      if (!id1 || !id2) {
        return makeHttpError({
          error: 'please provide both ids',
          statusCode: 422
        })
      }
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 201,
        data: newFriendship
      }
    } catch (err) {
      console.error('[friend endpoint handler] Error posting friendship', err)
      return makeHttpError({
        error: err.message,
        statusCode: 500
      })
    }
  }
  async function getFriendship(httpRequest){
    try {
      const { type, id } = httpRequest.pathParams
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
      console.error('[friend endpoint handler] Error getting user friendships', err)
      return makeHttpError({
        error: err.message,
        statusCode: 500
      })
    }
  }
  async function deleteFriendship(httpRequest){
    try {
      const { id1, id2 } = JSON.parse(JSON.stringify(httpRequest.body))
      const removal = await userActions.removeFriendship(id1, id2)
      if (!id1 || !id2) {
        return makeHttpError({
          error: 'Both ids are needed to remove a friendship',
          statusCode: 422
        })
      }
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: removal ? 200 : 204,
        data: {rowsRemoved: removal}
      }
    } catch (err) {
      console.error('[friend endpoint handler] Error removing friendship', err)
      return makeHttpError({
        error: err.message,
        statusCode: 500
      })
    }
  }
}

module.exports = makeFriendsEndpointHandler
