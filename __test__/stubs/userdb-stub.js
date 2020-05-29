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
      return userMap.get(user.getId())
    },
    findById: async userId => {
      const userInfo = userMap.get(userId)
      return userInfo
    },
    update: async user => {
      userMap.set(user.getId(),{
        ...userMap.get(user.getId()),
        username: user.getUsername(),
        email: user.getEmail(),
        password: user.getPassword(),
        longitude: user.getSource().longitude,
        latitude: user.getSource().latitude,
        language: user.getSource().language
      })
      return userMap.get(user.getId())
    },
    remove: async function(userId) {
      if (!userMap.has(userId)){
        return 0
      }
      const friends = friendshipMap.get(userId)
      friends.forEach( friend => {
        this.removeFriendship(userId, friend)
      })
      friendshipMap.delete(userId)
      userMap.delete(userId)
      return 1
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
      return {befriender: userId1, userid: userId2}
    },
    removeFriendship: async (userId1, userId2) => {
      if(!userId1 || !userId2) {
        throw new Error('missing an id parameter')
      } 
      const userId1Index = friendshipMap.get(userId2).findIndex( elem => elem === userId1)
      const userId2Index = friendshipMap.get(userId1).findIndex( elem => elem === userId2)
      if(userId1Index === -1 || userId2Index === -1){
        return 0
      }
      friendshipMap.set(userId1, [
        ...friendshipMap.get(userId1).slice(0, userId2Index), 
        ...friendshipMap.get(userId1).slice(userId2Index + 1)
      ])
      friendshipMap.set(userId2, [
        ...friendshipMap.get(userId2).slice(0, userId1Index), 
        ...friendshipMap.get(userId2).slice(userId1Index + 1)
        ])
      return 1
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
