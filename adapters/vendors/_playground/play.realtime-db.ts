import { Json } from 'redux-connected-types';
import * as fs from 'fs-extra';
import { small } from 'rc-adapter-fixtures';

const REALTIME_DB_PROJECT_ID = 'amazing-de4d0';

const axios = require('axios');

export const realtimeDbSeed = async () => {
    await fetchRealtimeDb('/user.json', 'PUT', small.user);
    await fetchRealtimeDb('/products.json', 'PUT', arrayToObject(small.products)); // prettier-ignore
    await fetchRealtimeDb('/logs.json', 'PUT', arrayToObject(small.logs));
    await fetchRealtimeDb('/chats.json', 'PUT', arrayToObject(small.chats));
    await fetchRealtimeDb('/chatsItems.json', 'PUT', arrayToObject(small.chatItems)); // prettier-ignore
};

export const realtimeDbGet = async () => {
    let data;

    data = await fetchRealtimeDb('/user.json');
    fs.writeJsonSync('./_temp/realtime-db/user.json', data, { spaces: 4 });

    data = await fetchRealtimeDb('/products.json');
    fs.writeJsonSync('./_temp/realtime-db/products.json', data, { spaces: 4 });

    data = await fetchRealtimeDb('/logs.json');
    fs.writeJsonSync('./_temp/realtime-db/logs.json', data, { spaces: 4 });

    data = await fetchRealtimeDb('/chats.json');
    fs.writeJsonSync('./_temp/realtime-db/chats.json', data, { spaces: 4 });

    data = await fetchRealtimeDb('/chatsItems.json');
    fs.writeJsonSync('./_temp/realtime-db/chatsItems.json', data, { spaces: 4 }); // prettier-ignore
};

const instanceRealtimeDb = axios.create({
    baseURL: `https://${REALTIME_DB_PROJECT_ID}.firebaseio.com`,
});

const fetchRealtimeDb = (
    path: string,
    method: string = 'GET',
    data?: Json,
    params?: Json
) => {
    return instanceRealtimeDb
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
