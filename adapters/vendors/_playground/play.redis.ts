import { Json } from 'redux-connected-types';
import * as fs from 'fs-extra';
import { small } from 'rc-adapter-fixtures';

const REALTIME_DB_PROJECT_ID = 'amazing-de4d0';

const axios = require('axios');

export const redisSeed = async () => {
    await fetchRedis('/user.json', 'PUT', small.user);
    await fetchRedis('/products.json', 'PUT', arrayToObject(small.products)); // prettier-ignore
    await fetchRedis('/logs.json', 'PUT', arrayToObject(small.logs));
    await fetchRedis('/chats.json', 'PUT', arrayToObject(small.chats));
    await fetchRedis('/chatsItems.json', 'PUT', arrayToObject(small.chatItems)); // prettier-ignore
};

export const redisGet = async () => {
    let data;

    data = await fetchRedis('/user.json');
    fs.writeJsonSync('./_temp/redis/user.json', data, { spaces: 4 });

    data = await fetchRedis('/products.json');
    fs.writeJsonSync('./_temp/redis/products.json', data, { spaces: 4 });

    data = await fetchRedis('/logs.json');
    fs.writeJsonSync('./_temp/redis/logs.json', data, { spaces: 4 });

    data = await fetchRedis('/chats.json');
    fs.writeJsonSync('./_temp/redis/chats.json', data, { spaces: 4 });

    data = await fetchRedis('/chatsItems.json');
    fs.writeJsonSync('./_temp/redis/chatsItems.json', data, { spaces: 4 }); // prettier-ignore
};

const instanceRedis = axios.create({
    baseURL: `https://${REALTIME_DB_PROJECT_ID}.firebaseio.com`,
});

const fetchRedis = (
    path: string,
    method: string = 'GET',
    data?: Json,
    params?: Json
) => {
    return instanceRedis
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
