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
  xit('throws an error when the user already exists', async () => {
    const userInfo = makeFakeUser()
  
    await userActions.create(userInfo)

    await expect(userActions.create(userInfo)).rejects.toThrow()
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
  xit('throws an error when attempting to update an unexisting user', async () => {
    const userInfo = makeFakeUser()
  
    const changedUserInfo = {...userInfo, username: "PepeTest"}
    const changedUser = changedUserInfo

    await expect(userActions.update(changedUser)).rejects.toThrow('User not found')
  })
  it('removes a user', async () => {
    const userInfo = makeFakeUser()

    await userActions.create(userInfo)
    
    await userActions.remove(userInfo.id)

    await expect(userActions.getById(userInfo.id)).rejects.toThrow('User not found')
  })
  xit('creates a new entry at the friendship adjacency list alongside every new user', async () => {
    const userInfo = makeFakeUser()

    await userActions.create(userInfo)
    const friendships = await userActions.getFriends(userInfo.id)

    expect(friendships).toEqual([])
  })
  it('registers a new friendship for both users', async () => {
    expect.assertions(2)
    const user1Info = makeFakeUser()
    const user2Info = makeFakeUser()

    await userActions.create(user1Info)
    await userActions.create(user2Info)
   
    await userActions.addFriendship(user1Info.id, user2Info.id) 

    expect(await userActions.getFriends(user1Info.id)).toContain(user2Info.id)
    expect(await userActions.getFriends(user2Info.id)).toContain(user1Info.id)

  })
  xit('make sure the same friendship cannot be stored twice', async () => {
    expect.assertions(3)
    const user1Info = makeFakeUser()
    const user2Info = makeFakeUser()

    await userActions.create(user1Info)
    await userActions.create(user2Info)
   
    await userActions.addFriendship(user1Info.id, user2Info.id) 
    expect(await userActions.getFriends(user1Info.id)).toContain(user2Info.id)
    expect(await userActions.getFriends(user2Info.id)).toContain(user1Info.id)

    await expect(userActions.addFriendship(user1Info.id, user2Info.id)).rejects.toThrow('Friendship already exists')
  
  })
  xit('throws an error when you dont introduce the id of both friends', async () => {
    const user1Info = makeFakeUser()
    const user2Info = makeFakeUser()

    await userActions.create(user1Info)
    await userActions.create(user2Info)
   
    await expect(userActions.addFriendship(user1Info.id)).rejects.toThrow('Both ids are needed for establishing a friendship')
  })
  it('removes a friendship on both ends', async () => {
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
  xit('throws when the userId is not in the friendlist', async () => {})
  it('deletes all friendships when removing a user', async () => {
    expect.assertions(3)
    const user1Info = makeFakeUser()
    const user2Info = makeFakeUser()
    const user3Info = makeFakeUser()

    await userActions.create(user1Info)
    await userActions.create(user2Info)
    await userActions.create(user3Info)
   
    await userActions.addFriendship(user1Info.id, user2Info.id) 
    await userActions.addFriendship(user1Info.id, user3Info.id) 

    await userActions.remove(user1Info.id)
    
    await expect( userActions.getFriends(user1Info.id)).rejects.toThrow('User not found')
    await expect (userActions.getFriends(user2Info.id)).not.toContain(user1Info.id)
    await expect (userActions.getFriends(user3Info.id)).not.toContain(user1Info.id)
  })
})
