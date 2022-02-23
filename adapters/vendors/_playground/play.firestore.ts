import { Json } from 'redux-connected-types';
import * as fs from 'fs-extra';
import { small } from 'rc-adapter-fixtures';
const axios = require('axios');

const REALTIME_DB_PROJECT_ID = 'amazing-de4d0';

export const firestoreSeed = async () => {
    await setFirestoreSingleItem('user', small.user);
    await addFirestoreItems('/products', small.products);
    await addFirestoreItems('/logs', small.logs);
    await addFirestoreItems('/chats', small.chats);
    await addFirestoreItems('/chatsItems', small.chatItems);
};

const setFirestoreSingleItem = async (nodeName: string, item: Json) => {
    const params = {};
    params['documentId'] = nodeName;
    return fetchFirestore('/singles', 'POST', {fields: toFireStoreObject(item)}, params); // prettier-ignore
};

const addFirestoreItems = (path: string, items: Json[]) => {
    const promises = items.map((item) => addFirestoreItem(path, item));
    return Promise.all(promises);
};

const addFirestoreItem = (path: string, item: Json) => {
    const params = {};
    params['documentId'] = item.id;
    return fetchFirestore(path, 'POST', {fields: toFireStoreObject(item)}, params); // prettier-ignore
};

export const firestoreGet = async () => {
    let raw, data;

    raw = await fetchFirestore('/singles/user');
    data = firestoreDocumentToJson(raw);
    fs.writeJsonSync('./_temp/firestore/user.json', data, { spaces: 4 });

    raw = await fetchFirestore('/products');
    data = firestoreDocumentsToJson(raw.documents);
    fs.writeJsonSync('./_temp/firestore/products.json', data, { spaces: 4 });

    raw = await fetchFirestore('/logs');
    data = firestoreDocumentsToJson(raw.documents);
    fs.writeJsonSync('./_temp/firestore/logs.json', data, { spaces: 4 });

    raw = await fetchFirestore('/chats');
    data = firestoreDocumentsToJson(raw.documents);
    fs.writeJsonSync('./_temp/firestore/chats.json', data, { spaces: 4 });

    raw = await fetchFirestore('/chatsItems');
    data = firestoreDocumentsToJson(raw.documents);
    fs.writeJsonSync('./_temp/firestore/chatsItems.json', data, { spaces: 4 }); // prettier-ignore
};

const instanceFirestore = axios.create({
    baseURL: `https://firestore.googleapis.com/v1/projects/${REALTIME_DB_PROJECT_ID}/databases/(default)/documents`,
});

const fetchFirestore = (
    path: string,
    method: string = 'GET',
    data?: Json,
    params?: Json
) => {
    return instanceFirestore
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
            console.log('err ->', err.message);
        });
};

const toFireStoreObject = (object: Json) => {
    return Object.keys(object).reduce((output: any, key) => {
        let fieldKey;

        switch (getType(object[key], key)) {
            case 'string':
                fieldKey = 'stringValue';
                break;
            case 'number':
                fieldKey = 'doubleValue';
                break;
            case 'boolean':
                fieldKey = 'booleanValue';
                break;
        }

        output[key] = {
            [fieldKey]: object[key],
        };

        return output;
    }, {} as any);
};

const getType = (value: any, key: string) => {
    if (typeof value === 'string') {
        return 'string';
    }

    if (Number.isFinite(value)) {
        return 'number';
    }

    if (typeof value === 'boolean') {
        return 'boolean';
    }
};

type NullValue = { nullValue: null };
type BooleanValue = { booleanValue: boolean };
type IntegerValue = { integerValue: string };
type DoubleValue = { doubleValue: number };
type TimestampValue = { timestampValue: string };

type StringValue = { stringValue: string };
type BytesValue = { bytesValue: string };
type ReferenceValue = { referenceValue: string };
type GeoPointValue = {
    geoPointValue: {
        latitude: number;
        longitude: number;
    };
};
type ArrayValue = { arrayValue: Json[] };
type MapValue = { mapValue: Record<string, Json> };

type Value =
    | NullValue
    | BooleanValue
    | IntegerValue
    | DoubleValue
    | TimestampValue
    | StringValue
    | BytesValue
    | ReferenceValue
    | GeoPointValue
    | ArrayValue
    | MapValue;

type FirestoreDocument = {
    name: string;
    fields: Record<string, Value>;
    createTime: string;
    updateTime: string;
};

type FirestoreDocuments = FirestoreDocument[];

const firestoreDocumentToJson = (doc: FirestoreDocument) => {
    const output = {
        createTime: doc.createTime,
        updateTime: doc.updateTime,
    };

    Object.keys(doc.fields).forEach((key) => {
        const value = doc.fields[key];
        const innerValue = Object.values(value).pop();
        output[key] = innerValue;
    });

    return output;
};

const firestoreDocumentsToJson = (docs: FirestoreDocuments) => {
    return docs.map((doc) => firestoreDocumentToJson(doc));
};
