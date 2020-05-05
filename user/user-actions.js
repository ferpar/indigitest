function makeUserActions ({ userDb }) {
  return {
    create: async user => {
      try {
        await userDb.insert(user) 
      } catch (err) {
        console.error('[user-actions] Error creating user', err)
      }
    },
    getById: async userId => { 
      try {
        return await userDb.findById(userId) 
      } catch (err) {
        console.error('[user-actions] Error retrieving user by Id', err) 
      }
    },
    update: async user => {
      await userDb.update(user)
    },
    remove: async userId => {
      await userDb.remove(userId)
    },
    getFriends: async userId => await userDb.getFriends(userId),
    addFriendship: async (userId1, userId2) => await userDb.addFriendship(userId1, userId2),
    removeFriendship: async (userId1, userId2) => {
      await userDb.removeFriendship(userId1, userId2)
    },
    friendCount: async userId => await userDb.friendCount(userId)
  }
}

module.exports = makeUserActions
