# Indigitall tech proof
---

## Installation

  To get this API to work you'll need:

  1) Clone/download the repo and npm install as usual.
  2) Configure the postgresql database by feeding the dbexport.pgsql file to psql, considering the following.
      - db configuration ( as in ./src/db/config.json file )

```
{
		"user": "postgres",
		"password": "mysecpass",
		"database": "indigitest",
		"port": "5432",
		"host": "localhost"		
}
```
  That should do it. Keep in mind the server has a hardcoded port of 9090 => so expect it at http://localhost:9090 if you don't mess around with the index.js.

##Description

### API

This exercise consisted in building an API according to the given specification. As a result, the following API routes where created:

#### /user endpoint
- GET: Finds a user by its uuid identifier. Ex: http://localhost:9090/user/ck9wtqjex0000zqtl8yca3w0e 

- POST: Creates a user given a JSON containing te required information. Body input example:

```
{
	"id": "ck9vik2sw0000cytlchrg5kik",
  	"username": "Fran.Dietrch27",
  	"email": "Cale28@hotmail.cm",
  	"password": "lFgE9Cus7maKtpr",
  	"longitude": "27.3772", 
	"latitude": "81.1052",
	"language": "es"
}

```
SQL Constraints:

id => Primary Key ;
username => not null unique ;
email => not null unique ;
password => not null

Note: The id must be supplied as well. This is something that would easily be fixed given the time. You may use the fakeUser generator @ __test__/fixtures/user.js, it uses the uuid package.

- PATCH: Used to update Users by Id. Body input example:
```
{
	"id": "ck9vik2sw0000cytlchrg5kik",
  	"username": "Lola.Perez",
  	"email": "Cale28@hotmail.cm",
  	"password": "lFgE9Cus7maKtpr",
  	"longitude": "27.3772", 
	"latitude": "81.1052",
	"language": "es"
}
```
Only the id needs to remain the same in this case.

- DELETE: To remove users from the database. It also removes its friendships from the friends adjacency list. Ex: http://localhost:9090/user/ck9vik2sw0000cytlchrg5e8c .

Similarly to the GET route, it takes the user id as a path parameter.

#### /friend endpoint

- GET: Retrieves either the friendlist or the friendcount of a user given its id. Has two path parameters: **type** and **id**. 
  Follows the structure: /friend/:type/:id
  Examples: 
    http://localhost:9090/friend/count/ck9vik2sw0000cytlchrg5mai 
    http://localhost:9090/friend/list/ck9vik2sw0000cytlchrg5mai

- POST: Registers a new friendship given the id of both users in the friendship. Body input example:

``` 
{
	"id1": "ck9vik2sw0000cytlchrg5e8c",
	"id2": "ck9vik2sw0000cytlchrg5kak"
}
```
-DELETE: Unregisters a friendship given the id of both friends. Takes a similar body input as the POST method.

```
{
	"id1": "ck9vik2sw0000cytlchrg5e8c",
	"id2": "ck9vik2sw0000cytlchrg5kak"
}
```

### database

Two tables are being used to keep track of the users and friendships independently.

  - users Table:

  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(50) NOT NULL,
  email VARCHAR(355) UNIQUE NOT NULL,
  longitude FLOAT8,
  latitude FLOAT8,
  language VARCHAR(50)

  - friendships Table:

  user_id VARCHAR(50) PRIMARY KEY,
  friends VARCHAR(50)[]

### project structure

  The application was built following the clean architecture principles. At the core we have the user entity, its use cases are implemented via the controllers at ./src/controllers/user-actions which coordinates both inputs from the endpoints (./src/routes folder) and the database via the db-adater (at ./src/db/userdb.

  To keep the dependecies from the core outwards, less abstract dependencies are injected into the more abstract ones at build time. This architecture made it posible to use TDD right from the start, using a stub for the database, and not implementing the database and server until the core functionality was very advanced.

Note: a test was also used when creating the database adaptes, (at ./__test__/integration.spec.js. It cleans up its own mess, but maybe consider turning it off if you don't want to risk polluting the database when things fail.


Well, that's it for now, I hope this helps understand the project. Have a good day!


Made by Fernando Pérez de Ayala
