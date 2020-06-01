# Indigitall tech proof
---


## Installation

   ### Using docker for the database:
   
 1) Clone repo.
 2) Install dependencies as usual.
	```npm install```
 3) Build the image for the database from the Dockerfile at the root, i.e.: 
	```docker build -t indiPostgres```
 4) Run the docker container for the database:
	```docker run --name {container_name} -p 5432:5432 -e POSTGRES_PASSWORD=mysecpass -d indiPostgres```
 5) Start the server 
	```npm start ```
	
  Port and password must fit the values found in the config.json file found @ ./src/db/config.json
  
  ```
{
	"user": "postgres",
	"password": "mysecpass",
	"database": "indigitest",
	"port": "5432",
	"host": "localhost"		
}
```
### Without docker:

  1) Clone repo 
  2) Install dependencies:
  	```npm install as usual```
  3*) If your postgres database is not listening on the default port 5432, update the port at ./src/db/config.json.
  4) Making sure that postgres is running, create a new database within postgres: 
  	``` createdb -U postgres -T template0 indigitest```
  5) Then restore the base schema from the dump: ./src/scripts/dbexport.pgsql
	```psql -U postgres indigitest < ./src/scripts/dbexport.pgsql```
  	Make sure to modify the path accordingly if your current directory is not the root of the project.
  6) Finally, run the server: ```npm start```


  That should do it. Keep in mind the server has a hardcoded port of 9090 => so expect it at http://localhost:9090 if you don't mess around with the index.js.

## Description

### Project structure

Please note how the service "user-actions" does not directly depend on the databse. This was done by injecting the db into the service by means of a factory function @ /src/domain/user-service/index.js.

![depgraph](https://raw.githubusercontent.com/ferpar/indigitest/master/dependencygraph.svg "Dependencies")

The dependency injection pattern has been followed throughout the application. It allows to work separately on individual components on a test-driven basis (write tests first, then the code to fulfill the test assertions).

In a more object oriented fashion, this could also have been accomplished using typescript's interfaces instead of dependency injection and factory functions .

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
	"browserlang": "es"
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
	"browserlang": "es"
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
- DELETE: Unregisters a friendship given the id of both friends. Takes a similar body input as the POST method.

```
{
	"id1": "ck9vik2sw0000cytlchrg5e8c",
	"id2": "ck9vik2sw0000cytlchrg5kak"
}
```

### Database

#### ORM Conceptual Schema
The universe of discourse for this test produces the following ORM Conceptual Schema.

Here, the most complex elementary fact is given by: "User(.id) befriends User(.id)", where the verb befriend was chosen to avoid a symmetric relationship such as "User(.id) is friend of User(.id)". 


![ORM](https://raw.githubusercontent.com/ferpar/indigitest/master/assets/ORMIndigitech.PNG "Conceptual Schema")

The circular symbol attached to the binary roles is an assymetry constraint, meaning if we insert the fact "User1 befriends User2", it will no longer be possible to insert "User2 befriends User1" until the former relationship is removed. It also implies irreflexivity preventing the insertion of facts such as "User1 befriends User1" ( i.e.: in our model, a user may not be his own friend).

#### Relational Schema
Given the many to many relationship between users who befriend each other two tables are required.

![SQLSchema](https://raw.githubusercontent.com/ferpar/indigitest/master/assets/SchemaIndigitech.PNG "Tables")

#### RDMS Instructions
Note how the assymetry condition on the friendship relation is being enforced via:
- irreflexive CONSTRAINT @ friendship table declaration
- enforce_Asymmetry TRIGGER

```
--create schema/database within psql
CREATE DATABASE indigitest;

--connect to the database schema
\c indigitest

--create tables and trigger
CREATE TABLE Users ( 
	userId VARCHAR(25) NOT NULL PRIMARY KEY,
	email VARCHAR(30) NOT NULL,
	password VARCHAR(64) NOT NULL,
	username VARCHAR(30) NOT NULL,
	browserLang VARCHAR(10),
	latitude FLOAT8,
	longitude FLOAT8);

CREATE TABLE friendships(
	befriender VARCHAR(25) NOT NULL references Users on delete cascade,
	userId VARCHAR(25) NOT NULL references Users on delete cascade,
	CONSTRAINT irreflexive check (befriender <> userId),
	PRIMARY KEY (befriender, userId));

CREATE FUNCTION find_sym_trig() RETURNS trigger AS $find_sym_trig$
	BEGIN
		IF ( EXISTS(SELECT * FROM friendships WHERE befriender = NEW.userid AND userid = NEW.befriender) ) THEN
			RAISE EXCEPTION 'friendship already stored as symmetric';
		END IF;
		RETURN NEW;
	END;
$find_sym_trig$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_asymmetry BEFORE INSERT ON friendships
	FOR EACH ROW EXECUTE PROCEDURE find_sym_trig();
```


### things I would ve done given the time:

- make sure no clients are leaked from the database pool
- improve return values of several endpoints (give more feednback/information about each operation)
- improve error handling, making the API more robust
- add descriptions to the methods in each module
- dockerize both server and database via docker-compose
- configure via environment variables (dotenv)
- refactor the tests for the database adapter
- encrypt password before storage
- fix the use of JSON.parse(JSON.stringify()) to format input/output

