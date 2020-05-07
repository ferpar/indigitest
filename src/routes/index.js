const userDb = require('../db/userdb')
const makeUserActions = require('../controllers/user-actions')
const makeUsersEndpointHandler = require('./user-endpoint')
const makeFriendsEndpointHandler = require('./friend-endpoint')

const userActions = makeUserActions({ userDb })

const handleUserRequest = makeUsersEndpointHandler({ userActions })
const handleFriendRequest = makeFriendsEndpointHandler({ userActions })

module.exports = {
  handleUserRequest: async () => await handleUserRequest,
  handleFriendRequest: async () => await handleFriendRequest
}
