import { Json } from 'redux-connected-types';
import * as fs from 'fs-extra';
import { small } from 'rc-adapter-fixtures';

const REALTIME_DB_PROJECT_ID = 'amazing-de4d0';

const axios = require('axios');

export const mysqlSeed = async () => {
    await fetchMysql('/user.json', 'PUT', small.user);
    await fetchMysql('/products.json', 'PUT', arrayToObject(small.products)); // prettier-ignore
    await fetchMysql('/logs.json', 'PUT', arrayToObject(small.logs));
    await fetchMysql('/chats.json', 'PUT', arrayToObject(small.chats));
    await fetchMysql('/chatsItems.json', 'PUT', arrayToObject(small.chatItems)); // prettier-ignore
};

export const mysqlGet = async () => {
    let data;

    data = await fetchMysql('/user.json');
    fs.writeJsonSync('./_temp/mysql/user.json', data, { spaces: 4 });

    data = await fetchMysql('/products.json');
    fs.writeJsonSync('./_temp/mysql/products.json', data, { spaces: 4 });

    data = await fetchMysql('/logs.json');
    fs.writeJsonSync('./_temp/mysql/logs.json', data, { spaces: 4 });

    data = await fetchMysql('/chats.json');
    fs.writeJsonSync('./_temp/mysql/chats.json', data, { spaces: 4 });

    data = await fetchMysql('/chatsItems.json');
    fs.writeJsonSync('./_temp/mysql/chatsItems.json', data, { spaces: 4 }); // prettier-ignore
};

const instanceMysql = axios.create({
    baseURL: `https://${REALTIME_DB_PROJECT_ID}.firebaseio.com`,
});

const fetchMysql = (
    path: string,
    method: string = 'GET',
    data?: Json,
    params?: Json
) => {
    return instanceMysql
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
