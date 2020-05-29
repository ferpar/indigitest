function makeUserDb({ db }) {
  return Object.freeze({

    /**
     * insert: insert a new user in the database
     *
     * @async 
     * @param {Object} user - an object created from the user Model
     * @returns {Object} - flat object containing the inserted row
     */
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
          user.getSource().browserlang,
          user.getSource().longitude,
          user.getSource().latitude
        ]
      const result = await db.query(userText, userParams);
      return result.rows[0]
    },

    /**
     * findById: find a user given the userid
     *
     * @async
     * @param {String} userId
     * @returns {Object} - flat object containing the user (as stored in the users table)
     */
    findById: async userId => {
      const userInfoQuery = await db.query('SELECT * FROM users WHERE userid = $1', [userId])
      return userInfoQuery.rows[0]
    },

    /*
     * update: updates a user's stored information
     *
     * @async
     * @param {Object} user - an object created via the user Model
     * @returns {Object} - flat object containing the updated user information
     */
    update: async user => {
      const result = await db.query('UPDATE users SET (username, email, password, longitude, latitude, browserlang) ' + 
          '= ($1, $2, $3, $4, $5, $6) WHERE userid = $7 RETURNING *',[
            user.getUsername(),
            user.getEmail(),
            user.getPassword(),
            user.getSource().longitude,
            user.getSource().latitude,
            user.getSource().browserlang,
            user.getId()
          ])
      return result.rows[0]
    },

    /*
     * remove: removes a user from the database (friendships also removed by referential integrity)
     *
     * @async
     * @param {String} userId
     * @return {Number} - amount of rows deleted from the user table
     */
    remove: async function(userId){
      const removeQuery = await db.query('DELETE FROM users WHERE userid = $1', [userId])
      return removeQuery.rowCount
    },

    /*
     * addFriendship: registers a new friendship following the relation: "user1 befriends user1"
     *
     * @async
     * @param {String} userId1 - userId of user who starts the interaction (a.k.a. befriender)
     * @param {String} userId2 - userId of user who becomes friends with the befriender
     * @return {Object} - object following: 
     *                          {befriender: [befriender's userid], userid: [userid of befriended]}
     */
    addFriendship: async function(userId1, userId2){
      const result = await db.query('INSERT INTO friendships (befriender, userid) values ($1, $2) RETURNING *', [userId1, userId2] )
      return result.rows[0]
    },

    /*
     * getFriends: returns a users list of friends (both as befriender and befriended)
     *
     * @async
     * @param {String} userId
     * @return {Array} - array containing an object for each friend
     */
    getFriends: async userId => {
      const friendsListQuery = await db.query('SELECT userid FROM friendships WHERE befriender = $1 UNION' +
         ' SELECT befriender FROM friendships WHERE userid = $1', [userId])
      return friendsListQuery.rows
    },

    /*
     * removeFriendship: unregisters friendship between 2 users
     *
     * @async
     * @param {String} userId1
     * @param {String} userId2
     * @return {Number} - number of rows deleted at the friendships table
     */
    removeFriendship: async (userId1, userId2) => {
      const removeFriendshipQuery = await db.query('DELETE FROM friendships WHERE' + 
        ' (befriender = $1 AND userid = $2) OR ( befriender = $2 AND userid = $1 )', [userId1, userId2])
      return removeFriendshipQuery.rowCount
    },

    /*
     * friendCount: returns the number of friendships of a user
     *
     * @async
     * @param {String} userId
     * @return {Number} - number of friendships for this user at the friendships table
     */
    friendCount: async userId => {
      const friendsListQuery = await db.query('SELECT userid FROM friendships WHERE befriender = $1 UNION' +
         ' SELECT befriender FROM friendships WHERE userid = $1', [userId])
      return friendsListQuery.rowCount
    }
  })
}

module.exports = makeUserDb
