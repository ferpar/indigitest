const makeUsersEndpointHandler = require('./user-endpoint');
const makeFriendsEndpointHandler = require('./friend-endpoint');
const userActions = require('../domain/user-service');

const handleUserRequest = makeUsersEndpointHandler({ userActions });
const handleFriendRequest = makeFriendsEndpointHandler({ userActions });

module.exports = {
  handleUserRequest,
  handleFriendRequest
}
