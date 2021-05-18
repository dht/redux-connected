import { deleteCollection } from '../utils/firestore';
import {
    randomUser,
    randomProduct,
    randomGuid,
    randomChat,
    randomLog,
} from './../utils/random';

const admin = require('firebase-admin');
const serviceAccount = require('../../admin-sdk.json');

const PRODUCTS_COUNT = 500;
const CHATS_COUNT = 20;
const LOGS_COUNT = 200;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const run = async () => {
    let collectionRef, docRef, data, batch, guid;

    // clearing db
    await clear();

    // user
    console.time('adding user');
    collectionRef = db.collection('appState');
    docRef = collectionRef.doc('user');
    data = randomUser('user');
    await docRef.set(data);
    console.timeEnd('adding user');

    // products
    console.time(`adding ${PRODUCTS_COUNT} products`);
    batch = db.batch();
    collectionRef = db.collection('products');

    for (let i = 1; i <= PRODUCTS_COUNT; i++) {
        guid = randomGuid();
        docRef = collectionRef.doc(guid);
        data = randomProduct(guid, i);
        batch.set(docRef, data);
    }

    await batch.commit();
    console.timeEnd(`adding ${PRODUCTS_COUNT} products`);

    // chats
    console.time(`adding ${CHATS_COUNT} chats`);
    batch = db.batch();
    collectionRef = db.collection('chats');

    for (let i = 1; i <= CHATS_COUNT; i++) {
        guid = randomGuid();
        docRef = collectionRef.doc(guid);
        data = randomChat(guid);
        batch.set(docRef, data);
    }

    await batch.commit();
    console.timeEnd(`adding ${CHATS_COUNT} chats`);

    // logs
    console.time(`adding ${LOGS_COUNT} logs`);
    batch = db.batch();
    collectionRef = db.collection('logs');

    for (let i = 1; i <= LOGS_COUNT; i++) {
        guid = randomGuid();
        docRef = collectionRef.doc(guid);
        data = randomLog(guid);
        batch.set(docRef, data);
    }

    await batch.commit();
    console.timeEnd(`adding ${LOGS_COUNT} logs`);
};

const clear = async () => {
    console.time('clearing');
    await deleteCollection(db, '/appState');
    await deleteCollection(db, '/templates');
    await deleteCollection(db, '/users');
    await deleteCollection(db, '/logs');
    console.timeEnd('clearing');
};

run();
