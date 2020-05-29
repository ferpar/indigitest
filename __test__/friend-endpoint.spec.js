const makeFakeUser = require('./fixtures/user')
const makeUserDb = require('./stubs/userdb-stub')
const makeUserActions = require('../src/domain/user-service/user-actions')
const makeUsersEndpointHandler = require('../src/controllers/user-endpoint')
const makeFriendsEndpointHandler = require('../src/controllers/friend-endpoint')

describe('friends endpoint handler', () => {
  let handleFriendships
  beforeEach(()=> {
    const userDb = makeUserDb()
    const userActions = makeUserActions({ userDb })
    handleUser = makeUsersEndpointHandler({ userActions })
    handleFriendships = makeFriendsEndpointHandler({ userActions })
  })
  it('creates new friendships', async () => {
    const user1Info = makeFakeUser()
    const user2Info = makeFakeUser()

    await handleUser({
      method: 'POST',
      body: user1Info
    })
    await handleUser({
      method: 'POST',
      body: user2Info
    })

    const result = await handleFriendships({
      method: 'POST',
      body: {
        id1: user1Info.id,
        id2: user2Info.id
      }
    }) 

    expect(result.statusCode).toBe(201)
  })
  it('allows you to check a users friendships', async () => {
    const user1Info = makeFakeUser()
    const user2Info = makeFakeUser()
    const user3Info = makeFakeUser()

    await handleUser({
      method: 'POST',
      body: user1Info
    })
    await handleUser({
      method: 'POST',
      body: user2Info
    })
    await handleUser({
      method: 'POST',
      body: user3Info
    })

    await handleFriendships({
      method: 'POST',
      body: {
        id1: user1Info.id,
        id2: user2Info.id
      }
    }) 
    await handleFriendships({
      method: 'POST',
      body: {
        id1: user1Info.id,
        id2: user3Info.id
      }
    }) 

    const result = await handleFriendships({
      method: 'GET',
      pathParams: {type: 'list', id: user1Info.id }
    })

    expect(result.data.friends).toEqual([user2Info.id, user3Info.id])
     
  })
  it('returns a friend count', async () => {
    const user1Info = makeFakeUser()
    const user2Info = makeFakeUser()
    const user3Info = makeFakeUser()

    await handleUser({
      method: 'POST',
      body: user1Info
    })
    await handleUser({
      method: 'POST',
      body: user2Info
    })
    await handleUser({
      method: 'POST',
      body: user3Info
    })

    await handleFriendships({
      method: 'POST',
      body: {
        id1: user1Info.id,
        id2: user2Info.id
      }
    }) 
    await handleFriendships({
      method: 'POST',
      body: {
        id1: user1Info.id,
        id2: user3Info.id
      }
    }) 

    const result = await handleFriendships({
      method: 'GET',
      pathParams: {type: 'count', id: user1Info.id }
    })

    expect(result.data.friendCount).toEqual(2)
  })
  it('removes friendships', async () => {
    const user1Info = makeFakeUser()
    const user2Info = makeFakeUser()
    const user3Info = makeFakeUser()
    const user4Info = makeFakeUser()

    await handleUser({
      method: 'POST',
      body: user1Info
    })
    await handleUser({
      method: 'POST',
      body: user2Info
    })
    await handleUser({
      method: 'POST',
      body: user3Info
    })
    await handleUser({
      method: 'POST',
      body: user4Info
    })

    await handleFriendships({
      method: 'POST',
      body: {
        id1: user1Info.id,
        id2: user2Info.id
      }
    }) 
    await handleFriendships({
      method: 'POST',
      body: {
        id1: user1Info.id,
        id2: user3Info.id
      }
    }) 
    await handleFriendships({
      method: 'POST',
      body: {
        id1: user1Info.id,
        id2: user4Info.id
      }
    }) 

    await handleFriendships({
      method: 'DELETE',
      body: {
        id1: user1Info.id,
        id2: user3Info.id
      }
    })

    const result = await handleFriendships({
      method: 'GET',
      pathParams: {type: 'list', id: user1Info.id }
    })

    expect(result.data.friends).toEqual([user2Info.id, user4Info.id])
  })
})
