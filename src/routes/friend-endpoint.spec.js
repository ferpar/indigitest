const makeFakeUser = require('../../__test__/fixtures/user')
const makeUserDb = require('../../__test__/userdb-stub')
const makeUserActions = require('../controllers/user-actions')
const makeUsersEndpointHandler = require('./user-endpoint')
const makeFriendsEndpointHandler = require('./friend-endpoint')

describe('friends endpoint handler', () => {
  let handle
  beforeEach(()=> {
    const userDb = makeUserDb()
    const userActions = makeUserActions({ userDb })
    handleUser = makeUsersEndpointHandler({ userActions })
    handle = makeFriendsEndpointHandler({ userActions })
  })
  it('has a working test', () => {
    expect(1===1).toBe(true)
  })
  it('creates new friendships', async () => {
    const user1Info = makeFakeUser()
    const user2Info = makeFakeUser()

    await handleUser({
      method: 'POST',
      body: JSON.stringify(user1Info)
    })
    await handleUser({
      method: 'POST',
      body: JSON.stringify(user2Info)
    })

    const result = await handle({
      method: 'POST',
      body: JSON.stringify({
        id1: user1Info.id,
        id2: user2Info.id
      })
    }) 

    expect(result.statusCode).toBe(201)
  })
  it('allows you to check a users friendships', async () => {
    const user1Info = makeFakeUser()
    const user2Info = makeFakeUser()
    const user3Info = makeFakeUser()

    await handleUser({
      method: 'POST',
      body: JSON.stringify(user1Info)
    })
    await handleUser({
      method: 'POST',
      body: JSON.stringify(user2Info)
    })
    await handleUser({
      method: 'POST',
      body: JSON.stringify(user3Info)
    })

    await handle({
      method: 'POST',
      body: JSON.stringify({
        id1: user1Info.id,
        id2: user2Info.id
      })
    }) 
    await handle({
      method: 'POST',
      body: JSON.stringify({
        id1: user1Info.id,
        id2: user3Info.id
      })
    }) 

    const result = await handle({
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
      body: JSON.stringify(user1Info)
    })
    await handleUser({
      method: 'POST',
      body: JSON.stringify(user2Info)
    })
    await handleUser({
      method: 'POST',
      body: JSON.stringify(user3Info)
    })

    await handle({
      method: 'POST',
      body: JSON.stringify({
        id1: user1Info.id,
        id2: user2Info.id
      })
    }) 
    await handle({
      method: 'POST',
      body: JSON.stringify({
        id1: user1Info.id,
        id2: user3Info.id
      })
    }) 

    const result = await handle({
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
      body: JSON.stringify(user1Info)
    })
    await handleUser({
      method: 'POST',
      body: JSON.stringify(user2Info)
    })
    await handleUser({
      method: 'POST',
      body: JSON.stringify(user3Info)
    })
    await handleUser({
      method: 'POST',
      body: JSON.stringify(user4Info)
    })

    await handle({
      method: 'POST',
      body: JSON.stringify({
        id1: user1Info.id,
        id2: user2Info.id
      })
    }) 
    await handle({
      method: 'POST',
      body: JSON.stringify({
        id1: user1Info.id,
        id2: user3Info.id
      })
    }) 
    await handle({
      method: 'POST',
      body: JSON.stringify({
        id1: user1Info.id,
        id2: user4Info.id
      })
    }) 

    await handle({
      method: 'DELETE',
      body: JSON.stringify({
        id1: user1Info.id,
        id2: user3Info.id
      })
    })

    const result = await handle({
      method: 'GET',
      pathParams: {type: 'list', id: user1Info.id }
    })

    expect(result.data.friends).toEqual([user2Info.id, user4Info.id])
  })
})
