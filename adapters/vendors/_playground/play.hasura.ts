import { Json } from 'redux-connected-types';
import * as fs from 'fs-extra';
import { small } from 'rc-adapter-fixtures';

const REALTIME_DB_PROJECT_ID = 'amazing-de4d0';

const axios = require('axios');

export const hasuraSeed = async () => {
    await fetchHasura('/user.json', 'PUT', small.user);
    await fetchHasura('/products.json', 'PUT', arrayToObject(small.products)); // prettier-ignore
    await fetchHasura('/logs.json', 'PUT', arrayToObject(small.logs));
    await fetchHasura('/chats.json', 'PUT', arrayToObject(small.chats));
    await fetchHasura('/chatsItems.json', 'PUT', arrayToObject(small.chatItems)); // prettier-ignore
};

export const hasuraGet = async () => {
    let data;

    data = await fetchHasura('/user.json');
    fs.writeJsonSync('./_temp/hasura/user.json', data, { spaces: 4 });

    data = await fetchHasura('/products.json');
    fs.writeJsonSync('./_temp/hasura/products.json', data, { spaces: 4 });

    data = await fetchHasura('/logs.json');
    fs.writeJsonSync('./_temp/hasura/logs.json', data, { spaces: 4 });

    data = await fetchHasura('/chats.json');
    fs.writeJsonSync('./_temp/hasura/chats.json', data, { spaces: 4 });

    data = await fetchHasura('/chatsItems.json');
    fs.writeJsonSync('./_temp/hasura/chatsItems.json', data, { spaces: 4 }); // prettier-ignore
};

const instanceHasura = axios.create({
    baseURL: `https://${REALTIME_DB_PROJECT_ID}.firebaseio.com`,
});

const fetchHasura = (
    path: string,
    method: string = 'GET',
    data?: Json,
    params?: Json
) => {
    return instanceHasura
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
