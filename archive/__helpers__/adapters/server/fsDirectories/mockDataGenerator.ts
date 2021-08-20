import { FsDirectories } from '../../../../adapters/server/fsDirectories/adapterFsDirectories';
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
import {
    PRODUCTS_COUNT,
    CHATS_COUNT,
    LOGS_COUNT,
} from '../../globalMockDataConfiguration';
import fs from 'fs';

export const generateMockData = async () => {
    const db = new FsDirectories({
        fs,
        dbPath: './src/__fixtures__/fs/directories',
    });

    let docRef, data;

    db.load();

    // clearing db
    console.time('clearing');
    db.ref('chats').remove();
    db.ref('chatsItems').remove();
    db.ref('logs').remove();
    db.ref('products').remove();
    db.ref('user').remove();
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
        docRef = db.ref('products').push();
        docRef.set(product);
    }

    console.timeEnd(`adding ${PRODUCTS_COUNT} products`);

    // chats
    console.time(`adding ${CHATS_COUNT} chats`);

    for (let i = 1; i <= CHATS_COUNT; i++) {
        docRef = db.ref('chats').push();
        const chat = randomChat('');
        await docRef.set(chat);

        for (let j = 1; j <= randomInteger(15); j++) {
            const message = randomChatMessage('');
            message.parentId = docRef.key;
            docRef = db.ref(`chatsItems`).push();
            docRef.set(message);
        }
    }

    console.timeEnd(`adding ${CHATS_COUNT} chats`);

    // logs
    console.time(`adding ${LOGS_COUNT} logs`);

    for (let i = 1; i <= LOGS_COUNT; i++) {
        docRef = db.ref('logs').push();
        docRef.set(randomLog(''));
    }

    console.timeEnd(`adding ${LOGS_COUNT} logs`);
};
