const makeFakeUser = require('./fixtures/user')
const makeUser = require('../src/domain/models/user')
const db = require('../src/db')
const makeUserDb = require('../src/db/userdb/userdb')
const userDb = makeUserDb({ db })

const userInfo1 = makeFakeUser()
const userInfo2 = makeFakeUser()
const userInfo3 = makeFakeUser()
const userInfo4 = makeFakeUser()
const userInfo5 = makeFakeUser()
const user1 = makeUser(userInfo1)
const user1Modified = makeUser({...userInfo1, username: userInfo1.username + "_MODIFIED"})
const user2 = makeUser(userInfo2)
const user3 = makeUser(userInfo3)
const user4 = makeUser(userInfo4)
const user5 = makeUser(userInfo5)

describe('db-adapter for node-postgres(pg)', () => {
  afterAll( async () => {
    //clean up the mess
    await userDb.remove(user1.getId())
    await userDb.remove(user2.getId())
    await userDb.remove(user3.getId())
  })
  it('inserts users correctly', async () => {
    const res1 = await userDb.insert(user1)
    const res2 = await userDb.insert(user2)
    const res3 = await userDb.insert(user3)
    const res4 = await userDb.insert(user4)
    const res5 = await userDb.insert(user5)
    expect(res1.command).toBe('COMMIT')
    expect(res2.command).toBe('COMMIT')
    expect(res3.command).toBe('COMMIT')
    expect(res4.command).toBe('COMMIT')
    expect(res5.command).toBe('COMMIT')
  })
  it('finds users by Id', async () => {
    const res = await userDb.findById(userInfo1.id)
    expect(res.getId()).toEqual(user1.getId()) 
  })
  it('updates stored users', async () => {
    const res = await userDb.update(user1Modified)
    expect(res.username).toBe(user1Modified.getUsername())
  })
  it('removes users', async () => {
    const res = await userDb.remove(user5.getId())
    expect(res.command).toBe('COMMIT')
  })
  it('finds users friends', async () => {
    const res = await userDb.getFriends(user1.getId())
    expect(res).toStrictEqual([])
  })
  it('saves new friendships', async () => {
    const res1 = await userDb.addFriendship(user1.getId(), user2.getId()) 
    const res2 = await userDb.addFriendship(user1.getId(), user3.getId())
    const res3 = await userDb.addFriendship(user1.getId(), user4.getId())
    expect(res1.command).toBe('COMMIT')
    expect(res2.command).toBe('COMMIT')
    expect(res3.command).toBe('COMMIT')
  })
  it('removes friendships', async () => {
    const res1 = await userDb.removeFriendship(user1.getId(), user2.getId())
    expect(res1.command).toBe('COMMIT')
  })
  it('removes old friendships when removing a user', async () => {
    const res = await userDb.remove(user4.getId()) 
    expect(res.command).toBe('COMMIT')
  })
  it('returns a friendcount', async () => {
    const res = await userDb.friendCount(user1.getId())
    expect(res).toEqual(1)
  })
})
