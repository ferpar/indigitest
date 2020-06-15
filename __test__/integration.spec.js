const request = require('supertest')
const server = require('../src')
const db = require('../src/db')

const makeUserDb = require('../src/db/userdb/userdb')
const userDb = makeUserDb({ db })
const makeFakeUser = require('./fixtures/user')
const makeUser = require('../src/domain/user-model')

//----------pretest---------------
//this section 
//1) autogenerates random users for the test
//2) allows to reset the db state after each test

//this query clears all tables due to cascading references
const cleanupDbQuery = "DELETE FROM users;"

//generating user examples
const userInfoExamples = []
for ( let i = 5 ; i-- ; i > 0) {
  userInfoExamples.push(makeFakeUser({}, {
      hemisphere: 'North', 
      flatten: true
    })
  )
}
const userObjects = userInfoExamples
  .slice(1)
  .map( userInfo => makeUser(userInfo))

//function to use beforeEach test
async function resetInitialState() {
  //clean up DB
  await db.query(cleanupDbQuery);
  //insert Users
  for ( let userObj of userObjects ) {
   await userDb.insert(userObj)
  }
  //create friendships between user[1] and rest of users except user[0]
  for (let userObj of userObjects.slice(1) ) {
    await userDb.addFriendship(
      userObjects[0].getId(),
      userObj.getId()
    )
  }
}
//--------------------------------

//tests
describe('Indigitest API', () => {
  afterAll( async () => {
    await db.shutdown();
    server.close();
  })
  describe('/user resource', () => {
    beforeEach( async () => {
      await resetInitialState()
    })
    afterEach( async () => {
      await db.query(cleanupDbQuery) 
    })
    describe('POST Method', () => {
      it('stores new users', async () => {
        const resp = await request(server)
          .post('/user')
          .send(userInfoExamples[0]) //inserts user[0]
        expect(resp.statusCode).toEqual(201)
      }) 
    })
    describe('GET /user/{userId}', () => {
      it('finds users', async () => {
        expect.assertions(2)
        const resp = await request(server)
          .get(`/user/${userObjects[0].getId()}`)
        expect(resp.body.id).toEqual(userObjects[0].getId())
        expect(resp.statusCode).toEqual(200)
      })
    })
    describe('PUT /user/{userId}', () => {
      it('updates users', async () => {
        expect.assertions(2)
        const user0Infomodified = { 
          ...userInfoExamples[1],
          username:"TestyMcTestFace"
        }
        delete user0Infomodified.id
        const resp = await request(server)
          .put(`/user/${userInfoExamples[1].id}`)
          .send(user0Infomodified)
        expect(resp.body.username).toEqual("TestyMcTestFace")
        expect(resp.statusCode).toEqual(200)
      })
    })
    describe('DELETE /user/{userId}', () => {
      it('removes users', async () => {
        const resp = await request(server)
          .delete(`/user/${userObjects[2].getId()}`)
        expect(resp.body.removeCount).toEqual(1)
        expect(resp.statusCode).toEqual(200)
      })
    })
  })
  describe('/friend resource', () => {})
})



