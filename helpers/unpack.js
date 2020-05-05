function unpackUser(user) {
  return {
    id: user.getId(),
    username: user.getUsername(),
    email: user.getEmail(),
    password: user.getPassword(),
    source: {
      longitude: user.getSource().longitude,
      latitude: user.getSource().latitude,
      language: user.getSource().language
    }
  }
}

module.exports = unpackUser
