#!/bin/sh

echo "running docker container"
docker run --name pgdb -p 5432:5432 -e POSTGRES_PASSWORD=mysecpass -v ${PWD}:/scripts -d postgres & PID1=$!
wait $PID1
echo $PID1
# sleep 3
# echo "executing initialization script within the container"
# docker exec -d pgdb createdb -U postgres -T template0 indigitest & PID2=$!
# wait $PID2
# echo $PID2
# sleep 3
# echo "restoring from dump file"
# docker exec -d pgdb psql -U postgres indigitest < /scripts/dbexport.pgsql & PID3 = $!
# wait $PID3
# echo $PID3
# sleep 3
# echo "script finshed job"

