function buildMakeUser ({ Id, sanitize }) {
  return function makeUser ({
    id = Id.makeId(),
    username,
    email,
    password,
    source,
    longitude = source.longitude,
    latitude = source.latitude,
    language = source.language
  }) {
    if (id && !Id.isValidId(id)) {
      throw new Error('User must have a valid id')
    }
    if (username.length < 2) {
      throw new Error('username must be at least 2 characters long')
    } 
    if (password.length <= 6) {
      throw new Error('password must be at least 6 characters long')
    }
    if ( -180 > longitude || 180 < longitude){
      throw new Error('invalid longitude value: out of range (-180, 180)') 
    }
    if ( -90 > latitude || 90 < latitude){
      throw new Error('invalid latitude value: out of range (-90, 90)') 
    }
    if (sanitize(username) != username){
      throw new Error('invalid username')
    }
    if (sanitize(password) != password){
      throw new Error('invalid password')
    }
    if (sanitize(email) != email){
      throw new Error('invalid email')
    }
    return Object.freeze({
      getId: () => id,
      getUsername: () => username,
      getEmail: () => email,
      getPassword: () => password,
      getSource: () => Object.freeze({
        longitude,
        latitude,
        language
      })
    })
  }
}

module.exports = buildMakeUser
