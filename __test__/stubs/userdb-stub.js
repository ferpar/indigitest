const makeUser = require('../../src/user')
function makeUserDb () {
  const userMap = new Map()
  const friendshipMap = new Map()
  return Object.freeze({
    insert: async user => {
      if(userMap.has(user.getId())){
        throw new Error('Id taken: User already exists')
      }
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
         throw new Error('No such user')
      }
      const userInfo = userMap.get(userId)
      return makeUser(userInfo)
    },
    update: async user => {
      if (!userMap.has(user.getId())){
         throw new Error('No such user')
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
    remove: async function(userId) {
      if (!userMap.has(userId)){
        throw new Error('No such user')
      }
      const friends = friendshipMap.get(userId)
      friends.forEach( friend => {
        this.removeFriendship(userId, friend)
      })
      friendshipMap.delete(userId)
      userMap.delete(userId)
    },
    getFriends: async userId => {
      if (!friendshipMap.has(userId)){
        throw new Error('No such user on the friendlist')
      } else {
        return await friendshipMap.get(userId)
      } 
    },
    addFriendship: async (userId1, userId2) => {
      if(!userId1 || !userId2) {
        throw new Error('missing an id parameter')
      } 
      const userId1Index = friendshipMap.get(userId2).findIndex( elem => elem === userId1)
      const userId2Index = friendshipMap.get(userId1).findIndex( elem => elem === userId2)
      if(userId1Index !== -1 && userId2Index !== -1){
        throw new Error('friendship already stored')
      }
      friendshipMap.set(userId1, [...friendshipMap.get(userId1), userId2])
      friendshipMap.set(userId2, [...friendshipMap.get(userId2), userId1])
    },
    removeFriendship: async (userId1, userId2) => {
      if(!userId1 || !userId2) {
        throw new Error('missing an id parameter')
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
        throw new Error('No such user on the friendlist')
      }
      return friendshipMap.get(userId).length
    }
  })
}

module.exports = makeUserDb
