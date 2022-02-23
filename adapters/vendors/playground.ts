import { jsonServerGet } from './_playground/play.json-server';
import { realtimeDbGet, realtimeDbSeed } from './_playground/play.realtime-db';
import { firestoreGet, firestoreSeed } from './_playground/play.firestore';
import { apolloGet, apolloSeed } from './_playground/play.apollo';
import { atlasGet, atlasSeed } from './_playground/play.atlas';
import { hasuraGet, hasuraSeed } from './_playground/play.hasura';
import { mongoDbGet, mongoDbSeed } from './_playground/play.mongo-db';
import {
    elasticSearchGet,
    elasticSearchSeed,
} from './_playground/play.elastic-search';
import { mariaDbGet, mariaDbSeed } from './_playground/play.maria-db';
import { mysqlGet, mysqlSeed } from './_playground/play.mysql';
import { postgresGet, postgresSeed } from './_playground/play.postgreSql';
import { redisGet, redisSeed } from './_playground/play.redis';
import { sqliteGet, sqliteSeed } from './_playground/play.sqlite';

const run = async () => {
    // 1. apollo
    await apolloSeed();
    await apolloGet();

    // 2. atlas
    await atlasSeed();
    await atlasGet();

    // 3. elastic-search
    await elasticSearchSeed();
    await elasticSearchGet();

    // 4. firestore
    await firestoreSeed();
    await firestoreGet();

    // 5. hasura
    await hasuraSeed();
    await hasuraGet();

    // 6. json-server
    await jsonServerGet();

    // 7. maria-db
    await mariaDbSeed();
    await mariaDbGet();

    // 8. mongoDb
    await mongoDbSeed();
    await mongoDbGet();

    // 9. mysql
    await mysqlSeed();
    await mysqlGet();

    // 10. postgres
    await postgresSeed();
    await postgresGet();

    // 11. realtime-db
    await realtimeDbSeed();
    await realtimeDbGet();

    // 12. redis
    await redisSeed();
    await redisGet();

    // 13. sqlite
    await sqliteSeed();
    await sqliteGet();
};

run();
