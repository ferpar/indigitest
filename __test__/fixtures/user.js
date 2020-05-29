const faker = require('faker')
const Id = require('../../src/Id')
const { languages } = require('../../src/constants.json')

//second parameter hemisphere: 
//    North by default, 
//    any other value will imply South.

function makeFakeUser (overrides, hemisphere = 'North') {
 const user = {
   id: Id.makeId(),
   username: faker.internet.userName(),
   email: faker.internet.email(),
   password: faker.internet.password(),
   source: {
     longitude: faker.address.longitude(),
     latitude: hemisphere === 'North' 
        ? Math.abs(faker.address.latitude()) 
        : Math.abs(faker.address.latitude())*(-1),
     browserlang: languages[Math.floor(Math.random()*languages.length)]
   }
 }
  return {
    ...user,
    ...overrides
  }
}

module.exports = makeFakeUser
