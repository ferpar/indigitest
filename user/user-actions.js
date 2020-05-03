function makeUserActions ({ userDb }) {
  return {
    create: async user => {
      await userDb.insert(user) 
    },
    getById: async userId => await userDb.findById(userId),
    update: async user => {
      await userDb.update(user)
    }
    
  }
}

module.exports = makeUserActions
