import { JsonServerClient } from './../../../../adapters/client/jsonServer/jsonServer';
import {
    pickRandom,
    randomUser,
    randomProduct,
    randomChat,
    randomLog,
    randomChatMessage,
    randomInteger,
    generateDateArray,
} from '../../../random';
import axios from 'axios';
import {
    PRODUCTS_COUNT,
    CHATS_COUNT,
    LOGS_COUNT,
} from '../../globalMockDataConfiguration';
import fs from 'fs';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
});

export const generateMockData = async () => {
    const db = new JsonServerClient({
        axios: axiosInstance,
    });

    let docRef, data;

    // clearing db
    console.time('clearing');
    const content = JSON.stringify(
        {
            user: {},
            logs: [],
            products: [],
            chats: [],
            chatsItems: [],
        },
        null,
        4
    );
    fs.writeFileSync('./src/__fixtures__/fs/jsonServer/jsonDb.json', content);
    console.timeEnd('clearing');

    // user
    console.time('adding user');
    docRef = db.ref('user');
    data = randomUser('user');
    await docRef.set(data);
    console.timeEnd('adding user');

    // products
    console.time(`adding ${PRODUCTS_COUNT} products`);
    const dateArray = generateDateArray(new Date(2022, 10, 10), PRODUCTS_COUNT);

    for (let i = 1; i <= PRODUCTS_COUNT; i++) {
        const product = randomProduct('', i);
        product.price = i * 10;
        product.shippingDate = pickRandom(dateArray);
        await db.ref('products').push(product);
    }

    console.timeEnd(`adding ${PRODUCTS_COUNT} products`);

    // chats
    console.time(`adding ${CHATS_COUNT} chats`);

    for (let i = 1; i <= CHATS_COUNT; i++) {
        const chat = randomChat('');
        await db.ref('chats').push(chat);

        for (let j = 1; j <= randomInteger(15); j++) {
            const message = randomChatMessage('');
            message.parentId = chat.id;
            db.ref('chatsItems').push(message);
        }
    }

    console.timeEnd(`adding ${CHATS_COUNT} chats`);

    // logs
    console.time(`adding ${LOGS_COUNT} logs`);

    for (let i = 1; i <= LOGS_COUNT; i++) {
        docRef = db.ref('logs').push(randomLog(''));
    }

    console.timeEnd(`adding ${LOGS_COUNT} logs`);
};
