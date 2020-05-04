const makeUser = require('../user')
function makeUserDb () {
  const userMap = new Map()
  const friendshipMap = new Map()
  return Object.freeze({
    insert: async user => {
      userMap.set(user.getId(),{
        id: user.getId(),
        username: user.getUsername(),
        email: user.getEmail(),
        password: user.getPassword(),
        longitude: user.getSource().longitude,
        latitude: user.getSource().latitude,
        language: user.getSource().language
      })
      friendshipMap.set(user.getId(), [])
    },
    findById: async userId => {
      if (!userMap.has(userId)){
         return 'No such user'
      }
      const userInfo = userMap.get(userId)
      return makeUser(userInfo)
    },
    update: async user => {
      if (!userMap.has(user.getId())){
         return 'No such user'
      }
      userMap.set(user.getId(),{
        ...userMap.get(user.getId()),
        username: user.getUsername(),
        email: user.getEmail(),
        password: user.getPassword(),
        longitude: user.getSource().longitude,
        latitude: user.getSource().latitude,
        language: user.getSource().language
      })
    },
    remove: async user => {
      if (!userMap.has(user.getId())){
        throw Error('No such user')
      }
      userMap.delete(user.getId())
    },
    getFriends: async userId => {
      if (!friendshipMap.has(userId)){
        return 'No such user on the friendslist'
      } else {
        return await friendshipMap.get(userId)
      } 
    },
    addFriendship: async (userId1, userId2) => {
      if(!userId1 || !userId2) {
        return 'missing an id parameter'
      } 
      friendshipMap.set(userId1, [...friendshipMap.get(userId1), userId2])
      friendshipMap.set(userId2, [...friendshipMap.get(userId2), userId1])
    },
    removeFriendship: async (userId1, userId2) => {
      if(!userId1 || !userId2) {
        return 'missing an id parameter'
      } 
      const userId1Index = friendshipMap.get(userId2).findIndex( elem => elem === userId1)
      const userId2Index = friendshipMap.get(userId1).findIndex( elem => elem === userId2)

      friendshipMap.set(userId1, [
        ...friendshipMap.get(userId1).slice(0, userId2Index), 
        ...friendshipMap.get(userId1).slice(userId2Index + 1)
      ])
      friendshipMap.set(userId2, [
        ...friendshipMap.get(userId2).slice(0, userId1Index), 
        ...friendshipMap.get(userId2).slice(userId1Index + 1)
        ])
    },
    friendCount: async userId => {
      if (!friendshipMap.has(userId)){
        return 'No such user on the friendslist'
      }
      return friendshipMap.get(userId).length
    }
  })
}

module.exports = makeUserDb
