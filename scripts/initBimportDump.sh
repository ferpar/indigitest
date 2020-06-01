#!/bin/bash
set -e

psql -U postgres indigitest < /scripts/dbexport.pgsql
