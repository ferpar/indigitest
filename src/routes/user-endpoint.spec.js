const makeFakeUser = require('../../__test__/fixtures/user')
const makeUserDb = require('../../__test__/userdb-stub')
const makeUserActions = require('../controllers/user-actions')
const makeUsersEndpointHandler = require('./user-endpoint')


describe('users endpoint handler', () => {
  let handle
  beforeEach(() => {
    const userDb = makeUserDb()
    const userActions = makeUserActions({ userDb })
    handle = makeUsersEndpointHandler({ userActions })
  })
  it('creates new users', async () => {
    const result = await handle({
      method: 'POST',
      body: makeFakeUser()
    })
    expect(result.statusCode).toBe(201)
  }) 
  xit('encrypts user passwords before storage', () => {})
  it('finds users by id', async () => {
    const userInfo = makeFakeUser()

    await handle({
      method: 'POST',
      body: userInfo
    })

    const result = await handle({
      method: 'GET',
      pathParams: { id: userInfo.id }
    })

    expect(result.data.id).toBe(userInfo.id)
  })
  it('updates user information', async () => {
    const userInfo = makeFakeUser()
    const modifiedUserInfo = {...userInfo, username:"Manolo65"}

    await handle({
      method: 'POST',
      body: userInfo
    })

    const updateResponse = await handle({
      method: 'PATCH',
      body: JSON.stringify(modifiedUserInfo)
    })
    expect(updateResponse.statusCode).toBe(200)

    const result = await handle({
      method: 'GET',
      pathParams: { id: userInfo.id }
    })
    
    expect(result.data.username).toBe(modifiedUserInfo.username)
  })
  it('removes users', async () => {
    const userInfo = makeFakeUser()
    const modifiedUserInfo = {...userInfo, username:"Manolo65"}

    await handle({
      method: 'POST',
      body: userInfo
    })

    const deleteResponse = await handle({
      method: 'DELETE',
      pathParams: { id: userInfo.id }
    })
    expect(deleteResponse.statusCode).toBe(200)

    const result = await handle({
      method: 'GET',
      pathParams: { id: userInfo.id }
    })

    expect(result.statusCode).toBe(404)
  })
})
