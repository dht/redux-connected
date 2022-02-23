import { Json } from 'redux-connected-types';
import * as fs from 'fs-extra';
import { small } from 'rc-adapter-fixtures';

const REALTIME_DB_PROJECT_ID = 'amazing-de4d0';

const axios = require('axios');

export const mongoDbSeed = async () => {
    await fetchMongoDb('/user.json', 'PUT', small.user);
    await fetchMongoDb('/products.json', 'PUT', arrayToObject(small.products)); // prettier-ignore
    await fetchMongoDb('/logs.json', 'PUT', arrayToObject(small.logs));
    await fetchMongoDb('/chats.json', 'PUT', arrayToObject(small.chats));
    await fetchMongoDb('/chatsItems.json', 'PUT', arrayToObject(small.chatItems)); // prettier-ignore
};

export const mongoDbGet = async () => {
    let data;

    data = await fetchMongoDb('/user.json');
    fs.writeJsonSync('./_temp/mongo-db/user.json', data, { spaces: 4 });

    data = await fetchMongoDb('/products.json');
    fs.writeJsonSync('./_temp/mongo-db/products.json', data, { spaces: 4 });

    data = await fetchMongoDb('/logs.json');
    fs.writeJsonSync('./_temp/mongo-db/logs.json', data, { spaces: 4 });

    data = await fetchMongoDb('/chats.json');
    fs.writeJsonSync('./_temp/mongo-db/chats.json', data, { spaces: 4 });

    data = await fetchMongoDb('/chatsItems.json');
    fs.writeJsonSync('./_temp/mongo-db/chatsItems.json', data, { spaces: 4 }); // prettier-ignore
};

const instanceMongoDb = axios.create({
    baseURL: `https://${REALTIME_DB_PROJECT_ID}.firebaseio.com`,
});

const fetchMongoDb = (
    path: string,
    method: string = 'GET',
    data?: Json,
    params?: Json
) => {
    return instanceMongoDb
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
