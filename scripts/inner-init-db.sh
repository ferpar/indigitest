#!/bin/sh
createdb -U postgres -T template0 indigitest
psql -U postgres indigitest < /scripts/dbexport.pgsql

