FROM postgres
COPY ./initAcreateDb.sh ./docker-entrypoint-initdb.d
COPY ./initBimportDump.sh ./docker-entrypoint-initdb.d
COPY ./initCimportDump4test.sh ./docker-entrypoint-initdb.d

