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
  it('stores users and finds them by id', async () => {
    const userInfo = makeFakeUser()
    const user = makeUser(userInfo)

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
  it('creates a new entry at the friendship adjacency list alongside every new user', async () => {
    const userInfo = makeFakeUser()
    const user = makeUser(userInfo)

    await userActions.create(user)
    const friendships = await userActions.getFriends(userInfo.id)

    expect(friendships).toEqual([])
  })
  it('registers a new friendship for both users', async () => {
    expect.assertions(2)
    const user1Info = makeFakeUser()
    const user1 = makeUser(user1Info)
    const user2Info = makeFakeUser()
    const user2 = makeUser(user2Info)

    await userActions.create(user1)
    await userActions.create(user2)
   
    await userActions.addFriendship(user1Info.id, user2Info.id) 

    expect(await userActions.getFriends(user1Info.id)).toContain(user2Info.id)
    expect(await userActions.getFriends(user2Info.id)).toContain(user1Info.id)

  })
  it('make sure the same friendship cannot be stored twice', async () => {
    expect.assertions(3)
    const user1Info = makeFakeUser()
    const user1 = makeUser(user1Info)
    const user2Info = makeFakeUser()
    const user2 = makeUser(user2Info)

    await userActions.create(user1)
    await userActions.create(user2)
   
    await userActions.addFriendship(user1Info.id, user2Info.id) 
    expect(await userActions.getFriends(user1Info.id)).toContain(user2Info.id)
    expect(await userActions.getFriends(user2Info.id)).toContain(user1Info.id)

    expect(await userActions.addFriendship(user1Info.id, user2Info.id)).toBe('friendship already stored')
  
  })
  it('removes a friendship on both ends', async () => {
    expect.assertions(4)
    const user1Info = makeFakeUser()
    const user1 = makeUser(user1Info)
    const user2Info = makeFakeUser()
    const user2 = makeUser(user2Info)

    await userActions.create(user1)
    await userActions.create(user2)
   
    await userActions.addFriendship(user1Info.id, user2Info.id) 

    expect(await userActions.getFriends(user1Info.id)).toContain(user2Info.id)
    expect(await userActions.getFriends(user2Info.id)).toContain(user1Info.id)

    await userActions.removeFriendship(user1Info.id, user2Info.id)
    
    expect(await userActions.getFriends(user1Info.id)).not.toContain(user2Info.id)
    expect(await userActions.getFriends(user2Info.id)).not.toContain(user1Info.id)
  })
  it('correctly returns the friend count', async () => {
    const user1Info = makeFakeUser()
    const user1 = makeUser(user1Info)
    const user2Info = makeFakeUser()
    const user2 = makeUser(user2Info)
    const user3Info = makeFakeUser()
    const user3 = makeUser(user3Info)

    await userActions.create(user1)
    await userActions.create(user2)
    await userActions.create(user3)
   
    await userActions.addFriendship(user1Info.id, user2Info.id) 
    await userActions.addFriendship(user1Info.id, user3Info.id) 

    expect(await userActions.friendCount(user1Info.id)).toEqual(2)
  })
  it('deletes all friendships before removing a user', async () => {
    const user1Info = makeFakeUser()
    const user1 = makeUser(user1Info)
    const user2Info = makeFakeUser()
    const user2 = makeUser(user2Info)
    const user3Info = makeFakeUser()
    const user3 = makeUser(user3Info)

    await userActions.create(user1)
    await userActions.create(user2)
    await userActions.create(user3)
   
    await userActions.addFriendship(user1Info.id, user2Info.id) 
    await userActions.addFriendship(user1Info.id, user3Info.id) 

    await userActions.remove(user1)
    
  })
})
