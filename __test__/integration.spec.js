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

describe('db-adapter for node-postgres(pg)', () => {
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
    expect(res.username).toBe(user1Modified.getUsername())
  })
  xit('removes users', async () => {})
  it('finds users friends', async () => {
    const res = await userDb.getFriends(user1.getId())
    expect(res).toStrictEqual([])
  })
  it('saves new friendships', async () => {
    const res = await userDb.addFriendship(user1.getId(), user2.getId()) 
    expect(res.command).toBe('COMMIT')
  })
  xit('removes friendships', async () => {})
  xit('returns a friendcount', async () => {})

})
