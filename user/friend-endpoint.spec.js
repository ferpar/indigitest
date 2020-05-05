const makeFakeUser = require('../__test__/fixtures/user')
const makeUserDb = require('../__test__/userdb-stub')
const makeUserActions = require('./user-actions')
const makeFriendsEndpointHandler = require('./friend-endpoint')

describe('friends endpoint handler', () => {
  let handle
  beforeEach(()=> {
    const userDb = makeUserDb()
    const userActions = makeUserActions({ userDb })
    handle = makeFriendsEndpointHandler({ userActions })
  })
  it('has a working test', () => {
    expect(1===1).toBe(true)
  })

})
