import { Json } from 'redux-connected-types';
import * as fs from 'fs-extra';
import { small } from 'rc-adapter-fixtures';

const REALTIME_DB_PROJECT_ID = 'amazing-de4d0';

const axios = require('axios');

export const elasticSearchSeed = async () => {
    await fetchElasticSearch('/user.json', 'PUT', small.user);
    await fetchElasticSearch('/products.json', 'PUT', arrayToObject(small.products)); // prettier-ignore
    await fetchElasticSearch('/logs.json', 'PUT', arrayToObject(small.logs));
    await fetchElasticSearch('/chats.json', 'PUT', arrayToObject(small.chats));
    await fetchElasticSearch('/chatsItems.json', 'PUT', arrayToObject(small.chatItems)); // prettier-ignore
};

export const elasticSearchGet = async () => {
    let data;

    data = await fetchElasticSearch('/user.json');
    fs.writeJsonSync('./_temp/elastic-search/user.json', data, { spaces: 4 });

    data = await fetchElasticSearch('/products.json');
    fs.writeJsonSync('./_temp/elastic-search/products.json', data, {
        spaces: 4,
    });

    data = await fetchElasticSearch('/logs.json');
    fs.writeJsonSync('./_temp/elastic-search/logs.json', data, { spaces: 4 });

    data = await fetchElasticSearch('/chats.json');
    fs.writeJsonSync('./_temp/elastic-search/chats.json', data, { spaces: 4 });

    data = await fetchElasticSearch('/chatsItems.json');
    fs.writeJsonSync('./_temp/elastic-search/chatsItems.json', data, { spaces: 4 }); // prettier-ignore
};

const instanceElasticSearch = axios.create({
    baseURL: `https://${REALTIME_DB_PROJECT_ID}.firebaseio.com`,
});

const fetchElasticSearch = (
    path: string,
    method: string = 'GET',
    data?: Json,
    params?: Json
) => {
    return instanceElasticSearch
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
