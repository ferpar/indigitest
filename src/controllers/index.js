const makeUsersEndpointHandler = require('./user-endpoint');
const makeFriendsEndpointHandler = require('./friend-endpoint');
const userActions = require('../domain/user-service');

const userRequestHandler = makeUsersEndpointHandler({ userActions });
const friendRequestHandler = makeFriendsEndpointHandler({ userActions });

module.exports = {
  userRequestHandler,
  friendRequestHandler
}
