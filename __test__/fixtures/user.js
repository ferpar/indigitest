const faker = require('faker')
const Id = require('../../src/Id')
const { languages } = require('../../src/constants.json')

function makeFakeUser (overrides) {
 const user = {
   id: Id.makeId(),
   username: faker.internet.userName(),
   email: faker.internet.email(),
   password: faker.internet.password(),
   source: {
     longitude: faker.address.longitude(),
     latitude: faker.address.latitude(),
     language: languages[Math.floor(Math.random()*languages.length)]
   }
 }
  return {
    ...user,
    ...overrides
  }
}

module.exports = makeFakeUser
