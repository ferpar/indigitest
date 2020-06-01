FROM postgres
COPY ./scripts/dbexport.pgsql ./scripts/dbexport.pgsql
COPY ./scripts/initAcreateDb.sh ./docker-entrypoint-initdb.d
COPY ./scripts/initBimportDump.sh ./docker-entrypoint-initdb.d

