import { Json } from 'redux-connected-types';
import * as fs from 'fs-extra';
import { small } from 'rc-adapter-fixtures';

const axios = require('axios');

const instanceJsonServer = axios.create({
    baseURL: 'http://localhost:4756',
});

export const jsonServerGet = async () => {
    let data;

    data = await fetchJsonServer('/user');
    fs.writeJsonSync('./_temp/json-server/user.json', data, { spaces: 4 });

    data = await fetchJsonServer('/products');
    fs.writeJsonSync('./_temp/json-server/products.json', data, { spaces: 4 });

    data = await fetchJsonServer('/logs');
    fs.writeJsonSync('./_temp/json-server/logs.json', data, { spaces: 4 });

    data = await fetchJsonServer('/chats');
    fs.writeJsonSync('./_temp/json-server/chats.json', data, { spaces: 4 });
};

const fetchJsonServer = (
    path: string,
    method: string = 'GET',
    data?: Json,
    params?: Json
) => {
    return instanceJsonServer
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
