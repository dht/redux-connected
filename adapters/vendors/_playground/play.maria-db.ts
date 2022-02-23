import { Json } from 'redux-connected-types';
import * as fs from 'fs-extra';
import { small } from 'rc-adapter-fixtures';

const REALTIME_DB_PROJECT_ID = 'amazing-de4d0';

const axios = require('axios');

export const mariaDbSeed = async () => {
    await fetchMariaDb('/user.json', 'PUT', small.user);
    await fetchMariaDb('/products.json', 'PUT', arrayToObject(small.products)); // prettier-ignore
    await fetchMariaDb('/logs.json', 'PUT', arrayToObject(small.logs));
    await fetchMariaDb('/chats.json', 'PUT', arrayToObject(small.chats));
    await fetchMariaDb('/chatsItems.json', 'PUT', arrayToObject(small.chatItems)); // prettier-ignore
};

export const mariaDbGet = async () => {
    let data;

    data = await fetchMariaDb('/user.json');
    fs.writeJsonSync('./_temp/maria-db/user.json', data, { spaces: 4 });

    data = await fetchMariaDb('/products.json');
    fs.writeJsonSync('./_temp/maria-db/products.json', data, { spaces: 4 });

    data = await fetchMariaDb('/logs.json');
    fs.writeJsonSync('./_temp/maria-db/logs.json', data, { spaces: 4 });

    data = await fetchMariaDb('/chats.json');
    fs.writeJsonSync('./_temp/maria-db/chats.json', data, { spaces: 4 });

    data = await fetchMariaDb('/chatsItems.json');
    fs.writeJsonSync('./_temp/maria-db/chatsItems.json', data, { spaces: 4 }); // prettier-ignore
};

const instanceMariaDb = axios.create({
    baseURL: `https://${REALTIME_DB_PROJECT_ID}.firebaseio.com`,
});

const fetchMariaDb = (
    path: string,
    method: string = 'GET',
    data?: Json,
    params?: Json
) => {
    return instanceMariaDb
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
