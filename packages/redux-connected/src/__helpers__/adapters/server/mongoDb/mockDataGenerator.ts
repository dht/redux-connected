import { MongoDbClient } from '../../../../adapters/server/mongoDb/adapterMongo';
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
const MongoClient = require('mongodb').MongoClient;

export const generateMockData = async () => {
    const db = new MongoDbClient({
        MongoClient,
        url: 'mongodb://localhost:27017',
        dbName: 'redux-connected',
    });

    await db.connect();

    let docRef, data;

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
    await docRef.set(data, true);
    console.timeEnd('adding user');

    // products
    console.time(`adding ${PRODUCTS_COUNT} products`);
    const dateArray = generateDateArray(new Date(2022, 10, 10), PRODUCTS_COUNT);

    for (let i = 1; i <= PRODUCTS_COUNT; i++) {
        const product = randomProduct('', i);
        product.price = i * 10;
        product.shippingDate = pickRandom(dateArray);
        db.ref('products').push(product);
    }

    console.timeEnd(`adding ${PRODUCTS_COUNT} products`);

    // chats
    console.time(`adding ${CHATS_COUNT} chats`);

    for (let i = 1; i <= CHATS_COUNT; i++) {
        const chat = randomChat('');
        const res = await db.ref('chats').push(chat);

        for (let j = 1; j <= randomInteger(15); j++) {
            const message = randomChatMessage('');
            message.parentId = res.insertedId;
            db.ref(`chatsItems`).push(message);
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
