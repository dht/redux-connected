import { Json } from 'redux-connected-types';
import * as fs from 'fs-extra';
import { small } from 'rc-adapter-fixtures';

const REALTIME_DB_PROJECT_ID = 'amazing-de4d0';

const axios = require('axios');

export const postgresSeed = async () => {
    await fetchPostgres('/user.json', 'PUT', small.user);
    await fetchPostgres('/products.json', 'PUT', arrayToObject(small.products)); // prettier-ignore
    await fetchPostgres('/logs.json', 'PUT', arrayToObject(small.logs));
    await fetchPostgres('/chats.json', 'PUT', arrayToObject(small.chats));
    await fetchPostgres('/chatsItems.json', 'PUT', arrayToObject(small.chatItems)); // prettier-ignore
};

export const postgresGet = async () => {
    let data;

    data = await fetchPostgres('/user.json');
    fs.writeJsonSync('./_temp/postgres/user.json', data, { spaces: 4 });

    data = await fetchPostgres('/products.json');
    fs.writeJsonSync('./_temp/postgres/products.json', data, { spaces: 4 });

    data = await fetchPostgres('/logs.json');
    fs.writeJsonSync('./_temp/postgres/logs.json', data, { spaces: 4 });

    data = await fetchPostgres('/chats.json');
    fs.writeJsonSync('./_temp/postgres/chats.json', data, { spaces: 4 });

    data = await fetchPostgres('/chatsItems.json');
    fs.writeJsonSync('./_temp/postgres/chatsItems.json', data, { spaces: 4 }); // prettier-ignore
};

const instancePostgres = axios.create({
    baseURL: `https://${REALTIME_DB_PROJECT_ID}.firebaseio.com`,
});

const fetchPostgres = (
    path: string,
    method: string = 'GET',
    data?: Json,
    params?: Json
) => {
    return instancePostgres
        .request({
            url: path,
            method,
            data,
            params,
        })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log('err ->', err);
        });
};

const arrayToObject = (arr: any[]) =>
    arr.reduce((output: any, item) => {
        output[item.id] = item;
        return output;
    }, {} as any);
