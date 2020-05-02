const faker = require('faker')
const cuid = require('cuid')

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid
})

const locales = [
  en, es, fr, de, it, pt
]

export default function makeFakeUser (overrides) {
 const user = {
   id: Id.makeId(),
   username: faker.internet.userName,
   email: faker.internet.email,
   password: faker.internet.password,
   source: {
     longitude: faker.address.longitude,
     latitude: faker.address.latitude,
     locale: locales[Math.floor(Math.random()*locales.length)]
   }
 }
  return {
    ...user,
    ...overrides
  }
}
