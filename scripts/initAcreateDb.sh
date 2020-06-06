#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE indigitest;
    CREATE DATABASE indintdb;
    \\c indigitest
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

    CREATE FUNCTION find_sym_trig() RETURNS trigger AS \$\$
      BEGIN
        IF ( EXISTS(SELECT * FROM friendships WHERE befriender = NEW.userid AND userid = NEW.befriender) ) THEN
          RAISE EXCEPTION 'friendship already stored as symmetric';
        END IF;
        RETURN NEW;
      END;
    \$\$ LANGUAGE plpgsql;

    CREATE TRIGGER enforce_asymmetry BEFORE INSERT ON friendships
      FOR EACH ROW EXECUTE PROCEDURE find_sym_trig();
    \\c indintdb
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

    CREATE FUNCTION find_sym_trig() RETURNS trigger AS \$\$
      BEGIN
        IF ( EXISTS(SELECT * FROM friendships WHERE befriender = NEW.userid AND userid = NEW.befriender) ) THEN
          RAISE EXCEPTION 'friendship already stored as symmetric';
        END IF;
        RETURN NEW;
      END;
    \$\$ LANGUAGE plpgsql;

    CREATE TRIGGER enforce_asymmetry BEFORE INSERT ON friendships
      FOR EACH ROW EXECUTE PROCEDURE find_sym_trig();
EOSQL
