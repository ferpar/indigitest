const makeFakeUser = require('./fixtures/user')
const makeUser = require('../src/user')
const db = require('../src/db')
const makeUserDb = require('../src/db/userdb/userdb')
const userDb = makeUserDb({ db })

const userInfo1 = makeFakeUser()
const userInfo2 = makeFakeUser()
const userInfo3 = makeFakeUser()
const user1 = makeUser(userInfo1)
const user1Modified = makeUser({...userInfo1, username: userInfo1.username + "_MODIFIED"})
const user2 = makeUser(userInfo2)
const user3 = makeUser(userInfo3)

describe('db-adapter', () => {
  it('inserts users correctly', async () => {
    const res = await userDb.insert(user1)
    expect(res.command).toBe('COMMIT')
  })
  it('finds users by Id', async () => {
    const res = await userDb.findById(userInfo1.id)
    expect(res.getId()).toEqual(user1.getId()) 
  })
  it('updates stored users', async () => {
    const res = await userDb.update(user1Modified)
    await expect(res.username).toBe(user1Modified.getUsername())
  })
})
