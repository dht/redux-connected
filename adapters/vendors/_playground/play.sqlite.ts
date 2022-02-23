import { Json } from 'redux-connected-types';
import * as fs from 'fs-extra';
import { small } from 'rc-adapter-fixtures';

const REALTIME_DB_PROJECT_ID = 'amazing-de4d0';

const axios = require('axios');

export const sqliteSeed = async () => {
    await fetchSqlite('/user.json', 'PUT', small.user);
    await fetchSqlite('/products.json', 'PUT', arrayToObject(small.products)); // prettier-ignore
    await fetchSqlite('/logs.json', 'PUT', arrayToObject(small.logs));
    await fetchSqlite('/chats.json', 'PUT', arrayToObject(small.chats));
    await fetchSqlite('/chatsItems.json', 'PUT', arrayToObject(small.chatItems)); // prettier-ignore
};

export const sqliteGet = async () => {
    let data;

    data = await fetchSqlite('/user.json');
    fs.writeJsonSync('./_temp/sqlite/user.json', data, { spaces: 4 });

    data = await fetchSqlite('/products.json');
    fs.writeJsonSync('./_temp/sqlite/products.json', data, { spaces: 4 });

    data = await fetchSqlite('/logs.json');
    fs.writeJsonSync('./_temp/sqlite/logs.json', data, { spaces: 4 });

    data = await fetchSqlite('/chats.json');
    fs.writeJsonSync('./_temp/sqlite/chats.json', data, { spaces: 4 });

    data = await fetchSqlite('/chatsItems.json');
    fs.writeJsonSync('./_temp/sqlite/chatsItems.json', data, { spaces: 4 }); // prettier-ignore
};

const instanceSqlite = axios.create({
    baseURL: `https://${REALTIME_DB_PROJECT_ID}.firebaseio.com`,
});

const fetchSqlite = (
    path: string,
    method: string = 'GET',
    data?: Json,
    params?: Json
) => {
    return instanceSqlite
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
