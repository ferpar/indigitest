const makeFakeUser = require('./fixtures/user')
const makeUserDb = require('./stubs/userdb-stub')
const makeUserActions = require('../src/domain/user-service/user-actions')
const makeUsersEndpointHandler = require('../src/controllers/user-endpoint')


describe('users endpoint handler', () => {
  let handleUser
  beforeEach(() => {
    const userDb = makeUserDb()
    const userActions = makeUserActions({ userDb })
    handleUser = makeUsersEndpointHandler({ userActions })
  })
  it('creates new users', async () => {
    const result = await handleUser({
      method: 'POST',
      body: makeFakeUser()
    })
    expect(result.statusCode).toBe(201)
  }) 
  xit('encrypts user passwords before storage', () => {})
  it('finds users by id', async () => {
    const userInfo = makeFakeUser()

    await handleUser({
      method: 'POST',
      body: userInfo
    })

    const result = await handleUser({
      method: 'GET',
      pathParams: { id: userInfo.id }
    })

    expect(result.data.id).toBe(userInfo.id)
  })
  it('updates user information', async () => {
    expect.assertions(2)
    const userInfo = makeFakeUser()
    const modifiedUserInfo = {...userInfo, username:"Manolo65"}

    const storedUser = await handleUser({
      method: 'POST',
      body: userInfo
    })

    const updateResponse = await handleUser({
      method: 'PATCH',
      body: modifiedUserInfo
    })
    expect(updateResponse.statusCode).toBe(200)

    const result = await handleUser({
      method: 'GET',
      pathParams: { id: userInfo.id }
    })
    
    expect(result.data.username).toBe(modifiedUserInfo.username)
  })
  it('removes users', async () => {
    const userInfo = makeFakeUser()
    const modifiedUserInfo = {...userInfo, username:"Manolo65"}

    await handleUser({
      method: 'POST',
      body: userInfo
    })

    const deleteResponse = await handleUser({
      method: 'DELETE',
      pathParams: { id: userInfo.id }
    })
    expect(deleteResponse.statusCode).toBe(200)

    const result = await handleUser({
      method: 'GET',
      pathParams: { id: userInfo.id }
    })

    expect(result.statusCode).toBe(404)
  })
})
