const request = require('supertest')
const server = require('../src')
const db = require('../src/db')

//schema examples
const user1Input = {
        id: "ck9vik2sw0000cytlchrg5kik",
        username: "testyMctestFace",
        email: "Cale30@hotail.cm",
        password: "lFgE9Cus7maKtpr",
        longitude: 27.3772,
        latitude: 81.1052,
        browserlang: "es"
      }

//tests
describe('Post User Endpoint', () => {
  afterAll( async () => {
    await request(server).delete(`/user/${user1Input.id}`)
    db.shutdown()
    server.close()
  })
  it('should create a new user', async () => {
    const resp = await request(server)
      .post('/user')
      .send(user1Input)
    expect(resp.statusCode).toEqual(201)
  })  
})



