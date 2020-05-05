const makeFakeUser = require('../__test__/fixtures/user')
const makeUserDb = require('../__test__/userdb-stub')
const makeUserActions = require('./user-actions')
const makeUsersEndpointHandler = require('./user-endpoint')


describe('users endpoint handler', () => {
  let handle
  beforeEach(() => {
    const userDb = makeUserDb()
    const userActions = makeUserActions({ userDb })
    handle = makeUsersEndpointHandler({ userActions })
  })
  it('it has a working test', () => {
    expect(true).toBe(true)
  })
  it('creates new users', async () => {
    const result = await handle({
      method: 'POST',
      body: JSON.stringify(makeFakeUser())
    })
    expect(result.statusCode).toBe(201)
  }) 
  xit('encrypts user passwords before storage', () => {})
  it('finds users by id', async () => {
    const userInfo = makeFakeUser()

    await handle({
      method: 'POST',
      body: JSON.stringify(userInfo)
    })

    const result = await handle({
      method: 'GET',
      pathParams: userInfo.id
    })

    expect(result.data.id).toBe(userInfo.id)
  })
  it('updates user information', async () => {
    const userInfo = makeFakeUser()
    const modifiedUserInfo = {...userInfo, username:"Manolo65"}

    await handle({
      method: 'POST',
      body: JSON.stringify(userInfo)
    })

    const updateResponse = await handle({
      method: 'PATCH',
      body: JSON.stringify(modifiedUserInfo)
    })
    expect(updateResponse.statusCode).toBe(200)

    const result = await handle({
      method: 'GET',
      pathParams: userInfo.id
    })
    
    expect(result.data.username).toBe(modifiedUserInfo.username)
  })
  it('removes users', async () => {
    const userInfo = makeFakeUser()
    const modifiedUserInfo = {...userInfo, username:"Manolo65"}

    await handle({
      method: 'POST',
      body: JSON.stringify(userInfo)
    })

    const updateResponse = await handle({
      method: 'DELETE',
      body: JSON.stringify(modifiedUserInfo)
    })
    //expect(updateResponse.statusCode).toBe(200)

    const result = await handle({
      method: 'GET',
      pathParams: userInfo.id
    })

    
  })
})
