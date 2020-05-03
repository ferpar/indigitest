const makeFakeUser = require('../__test__/fixtures/user')
const makeUser = require('.')
const makeUserDb = require('../__test__/userdb-stub')
const makeUserActions = require('./user-actions')

describe('user actions', () => {
  let userActions
  beforeEach(() => {
    const userDb = makeUserDb();
    userActions = makeUserActions({ userDb })
  })
  it('has a working test suite', () => {
    expect(1===1).toBe(true) 
  })
  it('stores users and finds them by id', async () => {
    const userInfo = makeFakeUser()
    const user = makeUser(userInfo)

    console.log(userInfo)

    await userActions.create(user)

    const retrievedUser = await userActions.getById(user.getId())

    const retrievedUserInfo = {
      id: retrievedUser.getId(),
      username: retrievedUser.getUsername(),
      email: retrievedUser.getEmail(),
      password: retrievedUser.getPassword(),
      source: retrievedUser.getSource()
    }

    expect(retrievedUserInfo).toEqual(userInfo)
  })
  it('updates stored users', async () => {
    expect.assertions(2)
    const userInfo = makeFakeUser()
    const user = makeUser(userInfo)

    await userActions.create(user)

    const changedUserInfo = {...userInfo, username: "PepeTest"}
    const changedUser = makeUser(changedUserInfo)

    await userActions.update(changedUser)

    const retrievedUser = await userActions.getById(user.getId())

    const retrievedUserInfo = {
      id: retrievedUser.getId(),
      username: retrievedUser.getUsername(),
      email: retrievedUser.getEmail(),
      password: retrievedUser.getPassword(),
      source: retrievedUser.getSource()
    }

    expect(retrievedUserInfo).toEqual(changedUserInfo)
    expect(retrievedUserInfo).not.toEqual(userInfo)
  })
  it('removes a user', async () => {
    const userInfo = makeFakeUser()
    const user = makeUser(userInfo)

    await userActions.create(user)
    
    await userActions.remove(user)

    expect(await userActions.getById(userInfo.id)).toBe('No such user')
  })
})
