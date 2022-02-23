import { Json } from 'redux-connected-types';
import * as fs from 'fs-extra';
import { small } from 'rc-adapter-fixtures';

const REALTIME_DB_PROJECT_ID = 'amazing-de4d0';
const logPath = 'atlas';

const axios = require('axios');

export const atlasSeed = async () => {
    await fetchAtlas('/user.json', 'PUT', small.user);
    await fetchAtlas('/products.json', 'PUT', arrayToObject(small.products)); // prettier-ignore
    await fetchAtlas('/logs.json', 'PUT', arrayToObject(small.logs));
    await fetchAtlas('/chats.json', 'PUT', arrayToObject(small.chats));
    await fetchAtlas('/chatsItems.json', 'PUT', arrayToObject(small.chatItems)); // prettier-ignore
};

export const atlasGet = async () => {
    let data;

    data = await fetchAtlas('/user.json');
    fs.writeJsonSync(`./_temp/${logPath}/user.json`, data, { spaces: 4 });

    data = await fetchAtlas('/products.json');
    fs.writeJsonSync(`./_temp/${logPath}/products.json`, data, { spaces: 4 });

    data = await fetchAtlas('/logs.json');
    fs.writeJsonSync(`./_temp/${logPath}/logs.json`, data, { spaces: 4 });

    data = await fetchAtlas('/chats.json');
    fs.writeJsonSync(`./_temp/${logPath}/chats.json`, data, { spaces: 4 });

    data = await fetchAtlas('/chatsItems.json');
    fs.writeJsonSync(`./_temp/${logPath}/chatsItems.json`, data, { spaces: 4 }); // prettier-ignore
};

const instanceAtlas = axios.create({
    baseURL: `https://${REALTIME_DB_PROJECT_ID}.firebaseio.com`,
});

const fetchAtlas = (
    path: string,
    method: string = 'GET',
    data?: Json,
    params?: Json
) => {
    return instanceAtlas
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
