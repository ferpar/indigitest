const makeFakeUser = require('../__test__/fixtures/user')
const makeUserDb = require('../__test__/userdb-stub')
const makeUserActions = require('./user-actions')
const makeUsersEndpointHandler = require('./user-endpoint')

const userDb = makeUserDb()
const userActions = makeUserActions({ userDb })
const handle = makeUsersEndpointHandler({ userActions })

describe('users endpoint handler', () => {
  it('it has a working test', () => {
    expect(true).toBe(true)
  })
  xit('creates new users', async () => {
    const result = await handle({
      method: 'POST',
      body: JSON.stringify(makeFakeUser())
    })
  }) 
})
