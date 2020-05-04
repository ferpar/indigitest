function makeUserActions ({ userDb }) {
  return {
    create: async user => {
      await userDb.insert(user) 
    },
    getById: async userId => await userDb.findById(userId),
    update: async user => {
      await userDb.update(user)
    },
    remove: async user => {
      await userDb.remove(user)
    },
    getFriends: async userId => await userDb.getFriends(userId),
    addFriendship: async (userId1, userId2) => {
      await userDb.addFriendship(userId1, userId2)
    },
    removeFriendship: async (userId1, userId2) => {
      await userDb.removeFriendship(userId1, userId2)
    },
    friendCount: async userId => await userDb.friendCount(userId)
  }
}

module.exports = makeUserActions
