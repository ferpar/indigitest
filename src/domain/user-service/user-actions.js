const makeUser = require('../models/user')
function makeUserActions ({ userDb }) {
  return {
    create: async user => {
      const userObject = await makeUser(user)
      await userDb.insert(userObject) 
        .catch (err => {
          if(err.message === 'Id taken: User already exists'){
            throw new Error('Conflict: User already created')
          } else {
            console.error('[user-actions] Error creating user', err)
          }
        })
    },
    getById: async userId => { 
      try {
        return makeUser(await userDb.findById(userId))
      } catch (err) {
        if(err.message === 'No such user'){
          throw new Error('User not found')
        } else {
        console.error('[user-actions] Error retrieving user by Id', err) 
        }
      }
    },
    update: async user => {
      const userObject = await makeUser(user)
      await userDb.update(userObject)
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
