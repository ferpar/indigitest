const makeUser = require('../../user')
function makeUserDb({ db }) {
  return Object.freeze({
    insert: async function(user) {
     // const found = await this.findById(user.getId()) 
      //if (found) {
      //  throw new Error('Id taken: User already exists')
      //}
      
      const client = await db.connect()
      let response
      try {
        await client.query('BEGIN')

        const userText = 'INSERT INTO users (id, username, email, ' + 
          'password, longitude, latitude, language) VALUES ' +
          '($1, $2, $3, $4, $5, $6, $7)'
        const userParams = [
          user.getId(), 
          user.getUsername(), 
          user.getEmail(),
          user.getPassword(),
          user.getSource().longitude,
          user.getSource().latitude,
          user.getSource().language
        ]
        await client.query(userText, userParams)

        const friendshipText = 'INSERT INTO friendships (user_id, friends) VALUES ($1, $2)'
        const friendshipParams = [user.getId(), [] ]
        await client.query(friendshipText, friendshipParams)

        response = await client.query('COMMIT')

      } catch (err) {
        response = await client.query('ROLLBACK')
        console.error('[db-adapter] Error saving user', err)
        throw new Error(err.message)
      } finally {
        await client.release()
        return response
      }
      
    },
    findById: async userId => {
      const client = await db.connect()
      try {
        const userInfoQuery = await client.query('SELECT * FROM users WHERE id = $1', [userId])
        const userInfo = userInfoQuery.rows[0]
        if (!userInfo) {
          throw new Error('No such user')
        }
        return makeUser(userInfo)
      } catch (err) {
        console.error('[db-adapter] Error finding user by id', err)
      } finally {
        await client.release() 
      }
    },
    update: async user => {
      const client = await db.connect()
      let res
      try {
        res = await client.query('UPDATE users SET (username, email, password, longitude, latitude, language) ' + 
          '= ($1, $2, $3, $4, $5, $6) WHERE id = $7 RETURNING *',[
            user.getUsername(),
            user.getEmail(),
            user.getPassword(),
            user.getSource().longitude,
            user.getSource().latitude,
            user.getSource().language,
            user.getId()
          ])
      } catch (err) {
        console.error('[db-adapter] Error updating user', err)
      } finally {
        await client.release()
        return res.rows[0]
      }
    },
    remove: async function(userId){
      const client = await db.connect()
      let res
      try {
        await client.query('BEGIN')
        
        const friends = await this.getFriends(userId)
        for (friendIndex in friends) {
          await this.removeFriendship(userId, friends[friendIndex])
        }
        await client.query('DELETE FROM friendships WHERE user_id = $1', [userId])

        await client.query('DELETE FROM users WHERE id = $1', [userId])

        res = await client.query('COMMIT')
      } catch(err) {
        console.error('[db-adapter] Error removing user', err) 
        res = await client.query('ROLLBACK')
      } finally {
        await client.release()
        return res
      }
    },
    getFriends: async userId => {
      const client = await db.connect()
      let res
      try {
        const userFriendsQuery = await client.query('SELECT friends FROM friendships WHERE user_id = $1', [userId])
        res = userFriendsQuery.rows[0].friends
      } catch (err) {
        console.error('[db-adapter] Error getting list of friends', err)
      } finally {
        await client.release() 
        return res
      }
    },
    addFriendship: async function(userId1, userId2){
      const client = await db.connect()
      let res
      try {
        await client.query('BEGIN') 

        const user1FriendsQuery = await client.query('SELECT friends FROM friendships WHERE user_id = $1', [userId1])
        const user1Friends = JSON.parse(JSON.stringify(user1FriendsQuery.rows[0].friends))
        const user2FriendsQuery = await client.query('SELECT friends FROM friendships WHERE user_id = $1', [userId2])
        const user2Friends = JSON.parse(JSON.stringify(user1FriendsQuery.rows[0].friends))

        await client.query('UPDATE friendships SET friends = $1 WHERE user_id = $2', [
          [...user1Friends, userId2],
          userId1
        ])
        await client.query('UPDATE friendships SET friends = $1 WHERE user_id = $2', [
          [...user2Friends, userId1],
          userId2
        ])
        
        res = await client.query('COMMIT')

      } catch (err) {
        res = await client.query('ROLLBACK')
        console.error('[db-adapter] Error adding friends', err)
      } finally {
        await client.release()
        return res
      }
    },
    removeFriendship: async (userId1, userId2) => {
      const client = await db.connect()
      let res
      try {
        await client.query('BEGIN') 

        const user1FriendsQuery = await client.query('SELECT friends FROM friendships WHERE user_id = $1', [userId1])
        const user1Friends = JSON.parse(JSON.stringify(user1FriendsQuery.rows[0].friends))
        const user2FriendsQuery = await client.query('SELECT friends FROM friendships WHERE user_id = $1', [userId2])
        const user2Friends = JSON.parse(JSON.stringify(user1FriendsQuery.rows[0].friends))

        const userId1Index = user2Friends.findIndex( elem => elem === userId1)
        const userId2Index = user1Friends.findIndex( elem => elem === userId2)

        await client.query('UPDATE friendships SET friends = $1 WHERE user_id = $2', [
          [
            ...user1Friends.slice(0, userId2Index), 
            ...user1Friends.slice(userId2Index + 1)
          ],
          userId1
        ])
        await client.query('UPDATE friendships SET friends = $1 WHERE user_id = $2', [
          [
            ...user2Friends.slice(0, userId1Index), 
            ...user2Friends.slice(userId1Index + 1)
          ],
          userId2
        ])
        
        res = await client.query('COMMIT')

      } catch (err) {
        res = await client.query('ROLLBACK')
        console.error('[db-adapter] Error adding friends', err)
      } finally {
        await client.release()
        return res
      }
    
    },
    friendCount: async userId => {
      const client = await db.connect()
      let res
      try {
        const userFriendsQuery = await client.query('SELECT friends FROM friendships WHERE user_id = $1', [userId])
        res = userFriendsQuery.rows[0].friends.length
      } catch (err) {
        console.error('[db-adapter] Error getting list of friends', err)
      } finally {
        await client.release() 
        return res
      }
    }
  })
}

module.exports = makeUserDb
