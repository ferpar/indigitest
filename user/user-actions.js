function makeUserActions ({ userDb }) {
  return {
    create: async user => {
      
      await userDb.insert(user) 
        .catch (err => {
          if(err.message === 'Id Taken: User already exists'){
            throw new Error('User already created')
          } else {
            console.error('[user-actions] Error creating user', err)
          }
        })
    },
    getById: async userId => { 
      try {
        return await userDb.findById(userId) 
      } catch (err) {
        if(err.message === 'No such user'){
          throw new Error('User not found')
        } else {
        console.error('[user-actions] Error retrieving user by Id', err) 
        }
      }
    },
    update: async user => {
      await userDb.update(user)
        .catch(err => {
          if(err.message === 'No such user'){
            throw new Error('User not found')
          } else {
            console.error('[user-actions] Error updating user', err)
          }
        })
    },
    remove: async userId => {
      await userDb.remove(userId)
        .catch(err => {
          if(err.message === 'No such user'){
            throw new Error('User not found')
          } else {
            console.error('[user-actions] Error removing user', err)
          }
        })
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
