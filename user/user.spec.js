const makeFakeUser = require('../__test__/fixtures/user')
const makeUser = require('./index')

describe('social network user', () => {
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
  it('does not accept scripts: username', () => {
    const userObjSane = makeFakeUser({username: 'johnwick34'})
    const userObjInsane = makeFakeUser({username: '<p>this is not so fine</p>vladimir'})
    const userObjTotallyInsane = makeFakeUser({username: '<script>All your base are belong to us!</script>'})
    expect(() => makeUser(userObjSane)).not.toThrow()
    expect(() => makeUser(userObjInsane)).toThrow('invalid username')
    expect(() => makeUser(userObjTotallyInsane)).toThrow('invalid username')
  })
  it('does not accept scripts: password', () => {
    const userObjSane = makeFakeUser({password: 'johnwick34'})
    const userObjInsane = makeFakeUser({password: '<p>this is not so fine</p>vladimir'})
    const userObjTotallyInsane = makeFakeUser({password: '<script>All your base are belong to us!</script>'})
    expect(() => makeUser(userObjSane)).not.toThrow()
    expect(() => makeUser(userObjInsane)).toThrow('invalid password')
    expect(() => makeUser(userObjTotallyInsane)).toThrow('invalid password')
  })
  it('does not accept scripts: email', () => {
    const userObjSane = makeFakeUser({email: 'johnwick34@gmail.com'})
    const userObjInsane = makeFakeUser({email: '<p>this is not so fine</p>vladimir@yahoo.ru'})
    expect(() => makeUser(userObjSane)).not.toThrow()
    expect(() => makeUser(userObjInsane)).toThrow('invalid email')
  })
})
