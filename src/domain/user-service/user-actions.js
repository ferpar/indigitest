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
        .catch(err => {
          if(err.message = 'No such user on the friendlist'){
            throw new Error('User not found') 
          } else {
            console.error('[user-actions] Error getting friendships', err)
          }
        })
      return friendlist
    },
    addFriendship: async (userId1, userId2) => { 
      await userDb.addFriendship(userId1, userId2)
        .catch(err => {
          if(err.message === 'friendship already stored'){
            throw new Error('Friendship already exists')
          } else if(err.message === 'missing an id parameter') {
            throw new Error('Both ids are needed for establishing a friendship')
          }else {
            console.error('[user-actions] Error adding friendship', err)
          }
        })
    },
    removeFriendship: async (userId1, userId2) => {
      await userDb.removeFriendship(userId1, userId2)
        .catch(err => {
          if(err.message === 'missing an id parameter') {
            throw new Error('Both ids are needed to remove a friendship')
          } else {
            console.error('[user-actions] Error removing friendship', err)
          }
        })
    },
    friendCount: async userId => { 
      const friendcount = await userDb.friendCount(userId)
        .catch(err => {
          if(err.message = 'No such user on the friendlist'){
            throw new Error('User not found') 
          } else {
            console.error('[user-actions] Error getting friendcount', err)
          }
        })
      return friendcount
    }
  }
}

module.exports = makeUserActions
