const makeFakeUser = require('../__test__/fixtures/user')
const makeUser = require('./index')

describe('social network user', () => {
  it('can be tested', async () => {
    expect(1 === 1).toBe(true)
  })
  it('has an invalid id', () => {
    const userObj = makeFakeUser({id: '123'})
    expect(() => makeUser(userObj)).toThrow('User must have a valid id')
  })
  it('has username.length > 1', () => {
    const userObj = makeFakeUser({username: 'a'})
    expect(() => makeUser(userObj)).toThrow('username must be at least 2 characters long')
  })
  it('has a password at least 6 characters long', () => {
    const userObj = makeFakeUser({password: "xa6Zb"})
    expect(() => makeUser(userObj)).toThrow('password must be at least 6 characters long')
  })
  it('throws if a longitude is higher than 180', () => {
    const userObj = makeFakeUser({
      source:{
        longitude: 450,
        latitude: 30,
        language: 'en'
      }
    })
    expect(() => makeUser(userObj)).toThrow('invalid longitude value: out of range (-180, 180)')
  })
  it('throws if a longitude is lower than -180', () => {
    const userObj = makeFakeUser({
      source:{
        longitude: -270,
        latitude: 30,
        language: 'en'
      }
    })
    expect(() => makeUser(userObj)).toThrow('invalid longitude value: out of range (-180, 180)')
  })
  it('throws if a latitude is higher than 90', () => {
    const userObj = makeFakeUser({
      source:{
        longitude: 15,
        latitude: 93,
        language: 'en'
      }
    })
    expect(() => makeUser(userObj)).toThrow('invalid latitude value: out of range (-90, 90)')
  })
  it('throws if a latitude is lower than -90', () => {
    const userObj = makeFakeUser({
      source:{
        longitude: 15,
        latitude: -91,
        language: 'en'
      }
    })
    expect(() => makeUser(userObj)).toThrow('invalid latitude value: out of range (-90, 90)')
  })
})
