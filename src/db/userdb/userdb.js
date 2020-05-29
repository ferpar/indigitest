function makeUserDb({ db }) {
  return Object.freeze({
    insert: async function(user) {
      const userText = 'INSERT INTO users (userid, email,' + 
        ' password, username, browserlang, latitude, longitude)' +
        ' VALUES ($1, $2, $3, $4, $5, $6, $7)' +
        ' RETURNING *'
        const userParams = [
          user.getId(), 
          user.getEmail(),
          user.getPassword(),
          user.getUsername(), 
          user.getSource().language,
          user.getSource().longitude,
          user.getSource().latitude
        ]
      const result = await db.query(userText, userParams);
      return result.rows[0]
    },
    findById: async userId => {
      const userInfoQuery = await db.query('SELECT * FROM users WHERE userid = $1', [userId])
      return userInfoQuery.rows[0]
    },
    update: async user => {
      const result = await db.query('UPDATE users SET (username, email, password, longitude, latitude, browserlang) ' + 
          '= ($1, $2, $3, $4, $5, $6) WHERE userid = $7 RETURNING *',[
            user.getUsername(),
            user.getEmail(),
            user.getPassword(),
            user.getSource().longitude,
            user.getSource().latitude,
            user.getSource().language,
            user.getId()
          ])
      return result.rows[0]
    },
    remove: async function(userId){
      const removeQuery = await db.query('DELETE FROM users WHERE userid = $1', [userId])
      return removeQuery.rowCount
    },
    addFriendship: async function(userId1, userId2){
      const result = await db.query('INSERT INTO friendships (befriender, userid) values ($1, $2) RETURNING *', [userId1, userId2] )
      return result.rows[0]
    },
    getFriends: async userId => {
      const friendsListQuery = await db.query('SELECT userid FROM friendships WHERE befriender = $1 UNION' +
         ' SELECT befriender FROM friendships WHERE userid = $1', [userId])
      return friendsListQuery.rows
    },
    removeFriendship: async (userId1, userId2) => {
      const removeFriendshipQuery = await db.query('DELETE FROM friendships WHERE' + 
        ' (befriender = $1 AND userid = $2) OR ( befriender = $2 AND userid = $1 )', [userId1, userId2])
      return removeFriendshipQuery.rowCount
    },
    friendCount: async userId => {
      const friendsListQuery = await db.query('SELECT userid FROM friendships WHERE befriender = $1 UNION' +
         ' SELECT befriender FROM friendships WHERE userid = $1', [userId])
      return friendsListQuery.rowCount
    }
  })
}

module.exports = makeUserDb
