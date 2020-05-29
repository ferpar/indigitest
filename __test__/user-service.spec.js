const makeFakeUser = require('./fixtures/user')
const makeUserDb = require('./stubs/userdb-stub')
const makeUserActions = require('../src/domain/user-service/user-actions')

describe('user actions', () => {
  let userActions
  beforeEach(() => {
    const userDb = makeUserDb();
    userActions = makeUserActions({ userDb })
  })
  it('stores users and finds them by id', async () => {
    const userInfo = makeFakeUser()

    await userActions.create(userInfo)

    const retrievedUser = await userActions.getById(userInfo.id)

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

    await userActions.create(userInfo)

    const changedUserInfo = {...userInfo, username: "PepeTest"}
    const changedUser = changedUserInfo

    await userActions.update(changedUser)

    const retrievedUser = await userActions.getById(userInfo.id)

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

    await userActions.create(userInfo)
    
    await userActions.remove(userInfo.id)

    expect(await userActions.getById(userInfo.id)).toBeFalsy()
  })
  xit('registers a new friendship for both users', async () => {
    expect.assertions(2)
    const user1Info = makeFakeUser()
    const user2Info = makeFakeUser()

    await userActions.create(user1Info)
    await userActions.create(user2Info)
   
    await userActions.addFriendship(user1Info.id, user2Info.id) 

    expect(await userActions.getFriends(user1Info.id)).toContain(user2Info.id)
    expect(await userActions.getFriends(user2Info.id)).toContain(user1Info.id)

  })
  xit('removes a friendship on both ends', async () => {
    expect.assertions(4)
    const user1Info = makeFakeUser()
    const user2Info = makeFakeUser()

    await userActions.create(user1Info)
    await userActions.create(user2Info)
   
    await userActions.addFriendship(user1Info.id, user2Info.id) 

    expect(await userActions.getFriends(user1Info.id)).toContain(user2Info.id)
    expect(await userActions.getFriends(user2Info.id)).toContain(user1Info.id)

    await userActions.removeFriendship(user1Info.id, user2Info.id)
    
    expect(await userActions.getFriends(user1Info.id)).not.toContain(user2Info.id)
    expect(await userActions.getFriends(user2Info.id)).not.toContain(user1Info.id)
  })
  it('correctly returns the friend count', async () => {
    const user1Info = makeFakeUser()
    const user2Info = makeFakeUser()
    const user3Info = makeFakeUser()

    await userActions.create(user1Info)
    await userActions.create(user2Info)
    await userActions.create(user3Info)
   
    await userActions.addFriendship(user1Info.id, user2Info.id) 
    await userActions.addFriendship(user1Info.id, user3Info.id) 

    expect(await userActions.friendCount(user1Info.id)).toEqual(2)
  })
})
