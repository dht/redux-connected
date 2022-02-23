import { Json } from 'redux-connected-types';
import * as fs from 'fs-extra';
import { small } from 'rc-adapter-fixtures';

const REALTIME_DB_PROJECT_ID = 'amazing-de4d0';
const logPath = 'apollo';

const axios = require('axios');

export const apolloSeed = async () => {
    await fetchApollo('/user.json', 'PUT', small.user);
    await fetchApollo('/products.json', 'PUT', arrayToObject(small.products)); // prettier-ignore
    await fetchApollo('/logs.json', 'PUT', arrayToObject(small.logs));
    await fetchApollo('/chats.json', 'PUT', arrayToObject(small.chats));
    await fetchApollo('/chatsItems.json', 'PUT', arrayToObject(small.chatItems)); // prettier-ignore
};

export const apolloGet = async () => {
    let data;

    data = await fetchApollo('/user.json');
    fs.writeJsonSync(`./_temp/${logPath}/user.json`, data, { spaces: 4 });

    data = await fetchApollo('/products.json');
    fs.writeJsonSync(`./_temp/${logPath}/products.json`, data, { spaces: 4 });

    data = await fetchApollo('/logs.json');
    fs.writeJsonSync(`./_temp/${logPath}/logs.json`, data, { spaces: 4 });

    data = await fetchApollo('/chats.json');
    fs.writeJsonSync(`./_temp/${logPath}/chats.json`, data, { spaces: 4 });

    data = await fetchApollo('/chatsItems.json');
    fs.writeJsonSync(`./_temp/${logPath}/chatsItems.json`, data, { spaces: 4 }); // prettier-ignore
};

const instanceApollo = axios.create({
    baseURL: `https://${REALTIME_DB_PROJECT_ID}.firebaseio.com`,
});

const fetchApollo = (
    path: string,
    method: string = 'GET',
    data?: Json,
    params?: Json
) => {
    return instanceApollo
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
