const makeUser = require('../user-model')
function makeUserActions ({ userDb }) {
  return {
    create: async user => {
      const userObject = makeUser(user)
      const storedUserInfo = await userDb.insert(userObject) 
      return makeUser(storedUserInfo)
    },
    getById: async userId => { 
      const foundUser = await userDb.findById(userId)
      if (foundUser) {
        return makeUser(foundUser)
      } else {
       return false
      }
    },
    update: async user => {
      const userObject = await makeUser(user)
      const updatedUser = await userDb.update(userObject)
      if (updatedUser) {
        return makeUser(updatedUser)
      } else {
       return false
      }

    },
    remove: async userId => {
      return await userDb.remove(userId)
    },
    getFriends: async userId => {
      const friendlist = await userDb.getFriends(userId)
      return friendlist
    },
    addFriendship: async (userId1, userId2) => { 
      return await userDb.addFriendship(userId1, userId2)
    },
    removeFriendship: async (userId1, userId2) => {
      return await userDb.removeFriendship(userId1, userId2)
    },
    friendCount: async userId => { 
      const friendcount = await userDb.friendCount(userId)
      return friendcount
    }
  }
}

module.exports = makeUserActions
