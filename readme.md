# Indigitall tech proof
---


## Setup Instructions

 There are three options for a quick setup:
 
   ### Using docker-compose:
   
   1) Run the following command from the projects root directory: ```docker-compose up``` or ```sudo docker-compose up```
   
   The database information is permanently stored at ./dockerdata via a docker volume. Which will be created by docker-compose if not readily available. Make sure to give docker-compose the necessary permissions (via sudo if necessary). 

   ### Using docker for the database:
   
 1) Clone repo.
 2) Install dependencies as usual.
	```npm install```
 3) Move to the scripts directory
	
 4) Build the database image using the Dockerfile at the root folder, i.e.: 
	```docker build -t indipostgres .```
 5) Run the database container:
	```docker run --name {container_name} -p 5432:5432 -e POSTGRES_PASSWORD=mysecpass -d indipostgres```
 6) Start the server 
	```npm start ```
	
  Port and password must fit the values found in the config files found @ ./src/db/development.js and .src/db/test.js
  
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
  3) If your postgres database is not listening on the default port 5432, change the port at ./src/db/development.js and .src/db/test.js.
  4) Making sure that postgres is running, run the database intialization script:
  	```./scripts/initAcreateDb.sh```
	Otherwise, make sure you create both databases as in the .sh file above.
  5) Finally, run the server: ```npm start```


## Description

### Project structure

The project is an example of domain driven design with a layered architecture. As expected of a RESTful API, it is Event-Driven and part of a Client-Server distributed system. 

Emphasis was put on achieving dependency inversion between application layer and infrastructure details (web server and database).

Please note how the service "user-actions" does not directly depend on the database. This was achieved by injecting the db into the service by means of a factory function @ /src/domain/user-service/index.js.

![depgraph](https://raw.githubusercontent.com/ferpar/indigitest/master/assets/dependencygraph.svg "Dependencies")

The dependency injection pattern has been used throughout the application. It allows to work separately on individual components on a test-driven basis (write tests first, then the code to fulfill the test assertions).

In a more object oriented fashion, this could also have been accomplished using typescript's interfaces.

### API

The API has been defined according to the openAPI specification. You may inspect it at [swaggerhub](https://app.swaggerhub.com/apis/frhack/indigitest/1.0.0) or take a look at the [openAPI.yaml](https://github.com/ferpar/indigitest/blob/master/assets/indigitestOpenAPI.yaml) within the assets folder.

It comprises the following endpoints:

![endpoints](https://raw.githubusercontent.com/ferpar/indigitest/master/assets/APIStructure.png "Endpoints")


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
Note: The same is done for the database used for integration testing (indintdb), as can be seen in the intialization script @ ./src/scripts/initAcreateDb.sh .
