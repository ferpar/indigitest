const makeUserActions = require('./user-actions');
const userDb = require('../../db/userdb');

const usersService = makeUserActions({ userDb });

module.exports = usersService;