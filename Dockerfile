FROM postgres
COPY ./scripts/initAcreateDb.sh ./docker-entrypoint-initdb.d
COPY ./scripts/initBimportDump.sh ./docker-entrypoint-initdb.d
COPY ./scripts/initCimportDump4test.sh ./docker-entrypoint-initdb.d

