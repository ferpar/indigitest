const makeFakeUser = require('./fixtures/user')
const makeUser = require('../src/domain/user-model')
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

console.log(userInfo1)
console.log(userInfo2)
console.log(userInfo3)
console.log(userInfo4)
console.log(userInfo5)

describe('db-adapter for node-postgres(pg)', () => {
  afterAll( async () => {
    db.shutdown()
  })
  describe('insert, findById and update methods', () => {
    afterAll( async () => {
      await userDb.remove(userInfo1.id)
    })
    it('inserts users correctly', async () => {
      const res1 = await userDb.insert(user1)
      expect(res1.userid).toBe(userInfo1.id)
    })
    it('finds users by Id', async () => {
      const res = await userDb.findById(userInfo1.id)
      expect(res.userid).toEqual(userInfo1.id) 
    })
    it('updates stored users', async () => {
      const res = await userDb.update(user1Modified)
      expect(res.username).toBe(user1Modified.getUsername())
    })
  })
  describe('remove method', () => {
    beforeEach( async () => {
      await userDb.insert(user5)
    })
    it('removes users', async () => {
      const deleteCount = await userDb.remove(user5.getId())
      expect(deleteCount > 0).toBe(true)
    })
  })
  describe('friendship methods', () => {
    beforeAll( async () => {
      await userDb.insert(user1)
      await userDb.insert(user2)
      await userDb.insert(user3)
      await userDb.insert(user4)
    })
    afterAll(async () => {
      await userDb.remove(user1.getId())
      await userDb.remove(user2.getId())
      await userDb.remove(user3.getId())
    })
    it('saves new friendships', async () => {
      const res1 = await userDb.addFriendship(user1.getId(), user2.getId()) 
      expect(res1).toStrictEqual({befriender: userInfo1.id, userid: userInfo2.id})
    })
    it('finds users friends', async () => {
      await userDb.addFriendship(user1.getId(), user3.getId())
      await userDb.addFriendship(user4.getId(), user1.getId())
      const res = await userDb.getFriends(user1.getId())
      expect(res).toEqual(expect.arrayContaining([{userid: userInfo2.id}, {userid: userInfo3.id}, {userid: userInfo4.id}]))
    })
    it('removes friendships', async () => {
      const deleteCount = await userDb.removeFriendship(user1.getId(), user2.getId())
      expect(deleteCount > 0).toBe(true)
    })
    it('removes old friendships when removing a user', async () => {
      await userDb.remove(user4.getId()) 
      const res = userDb.getFriends(user1.getId())
      expect(res).toEqual(expect.not.arrayContaining([{userid: userInfo4.id}]))
    })
    it('returns a friendcount', async () => {
      const res = await userDb.friendCount(user1.getId())
      expect(res).toEqual(1)
    })
  })
})
