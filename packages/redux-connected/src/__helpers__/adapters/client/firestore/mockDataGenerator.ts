import { deleteCollection } from '../../../../adapters/client/firestore/utilsFirestore';
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

const admin = require('firebase-admin');
const serviceAccount = require('../../../../../admin-sdk.json');

admin.initializeApp({
    apiKey: 'AIzaSyAxvKA0fK61RJJh5-enKu7BN3Ie63q--Vc',
    authDomain: 'onew-fecbb.firebaseapp.com',
    databaseURL: 'https://onew-fecbb.firebaseio.com',
    projectId: 'onew-fecbb',
    storageBucket: 'onew-fecbb.appspot.com',
    messagingSenderId: '950138465044',
    appId: '1:950138465044:web:cd85ecea702b190c26b001',
    credential: admin.credential.cert(serviceAccount),
});

export const generateMockData = async () => {
    const db = admin.firestore();

    let collectionRef, docRef, data, batch;

    // clearing db
    console.time('clearing');
    await deleteCollection(db, '/chats');
    await deleteCollection(db, '/logs');
    await deleteCollection(db, '/products');
    await deleteCollection(db, '/singles');
    console.timeEnd('clearing');

    // user
    console.time('adding user');
    collectionRef = db.collection('singles');
    docRef = collectionRef.doc('user');
    data = randomUser('user');
    await docRef.set(data);
    console.timeEnd('adding user');

    // products
    console.time(`adding ${PRODUCTS_COUNT} products`);
    batch = db.batch();
    const dateArray = generateDateArray(new Date(2022, 10, 10), PRODUCTS_COUNT);

    for (let i = 1; i <= PRODUCTS_COUNT; i++) {
        const product = randomProduct('', i);
        product.price = i * 10;
        product.shippingDate = pickRandom(dateArray);
        docRef = db.collection('products').doc();
        batch.set(docRef, product);
    }

    await batch.commit();
    console.timeEnd(`adding ${PRODUCTS_COUNT} products`);

    // chats
    console.time(`adding ${CHATS_COUNT} chats`);
    batch = db.batch();

    for (let i = 1; i <= CHATS_COUNT; i++) {
        docRef = db.collection('chats').doc();
        batch.set(docRef, randomChat(''));

        for (let j = 1; j <= randomInteger(15); j++) {
            const message = randomChatMessage('');
            const innerRef = docRef.collection('items').doc();
            batch.set(innerRef, message);
        }
    }

    await batch.commit();

    console.timeEnd(`adding ${CHATS_COUNT} chats`);

    // logs
    console.time(`adding ${LOGS_COUNT} logs`);
    batch = db.batch();

    for (let i = 1; i <= LOGS_COUNT; i++) {
        docRef = db.collection('logs').doc();
        batch.set(docRef, randomLog(''));
    }

    await batch.commit();
    console.timeEnd(`adding ${LOGS_COUNT} logs`);
};
