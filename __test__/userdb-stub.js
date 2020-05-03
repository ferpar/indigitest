const makeUser = require('../user')
function makeUserDb () {
  const map = new Map()
  return Object.freeze({
    insert: async user => {
      map.set(user.getId(),{
        id: user.getId(),
        username: user.getUsername(),
        email: user.getEmail(),
        password: user.getPassword(),
        longitude: user.getSource().longitude,
        latitude: user.getSource().latitude,
        language: user.getSource().language
      })
    },
    findById: async userId => {
      if (!map.has(userId)){
         return 'No such user'
      }
      const userInfo = map.get(userId)
      return makeUser(userInfo)
    },
    update: async user => {
      if (!map.has(user.getId())){
         return 'No such user'
      }
      map.set(user.getId(),{
        ...map.get(user.getId()),
        username: user.getUsername(),
        email: user.getEmail(),
        password: user.getPassword(),
        longitude: user.getSource().longitude,
        latitude: user.getSource().latitude,
        language: user.getSource().language
      })
    },
    remove: async user => {
      if (!map.has(user.getId())){
        throw Error('No such user')
      }
      map.delete(user.getId())
    }
  })
}

module.exports = makeUserDb
