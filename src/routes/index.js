const userDb = require('../db/userdb')
const makeUserActions = require('../controllers/user-actions')
const makeUsersEndpointHandler = require('./user-endpoint')
const makeFriendsEndpointHandler = require('./friend-endpoint')

const userActions = makeUserActions({ userDb })

const usersEndpointHandler = makeUsersEndpointHandler({ userActions })
const friendsEndpointhandler = makeFriendsEndpointHandler({ userActions })

module.exports = {
  handleUserRequest: () => handleUserRequest,
  handleFriendRequest: () => handleFriendRequest
}
