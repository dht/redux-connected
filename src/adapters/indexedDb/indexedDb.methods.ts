import { Json } from '../../types';
import { get, set } from 'shared-base';
import { StorageXPath } from './IndexedDbQueryBuilder';

interface IndexedDb {
    get: (key: string, id: string) => Promise<Json | null>;
    set: (key: string, id: string, change: Json) => Promise<void>;
    getMany: (key: string, predicate: Json) => Promise<Json[] | null>;
    setMany: (key: string, data: Json[]) => Promise<void>;
    delete: (key: string, id: string) => Promise<void>;
    bulkDelete: (key: string, ids: string[]) => Promise<void>;
}

let indexedDb: IndexedDb = {
    get: (key: string, id: string) => Promise.resolve(null),
    set: (key: string, id: string, change: Json) => Promise.resolve(undefined),
    getMany: (key: string, predicate: Json) => Promise.resolve([]),
    setMany: (key: string, data: Json[]) => Promise.resolve(undefined),
    delete: (key: string, id: string) => Promise.resolve(undefined),
    bulkDelete: (key: string, ids: string[]) => Promise.resolve(undefined),
};

export const KEY = 'LOCAL_DATA_KEY';

export const initStorage = (value: IndexedDb) => {
    indexedDb = value;
};

export const getXPath = (storageXPath: StorageXPath) => {
    const allData = indexedDb.getJson(KEY) ?? {};
    const arr = storageXPathToPath(storageXPath);
    return get(allData, arr);
};

export const setXPath = (
    storageXPath: StorageXPath,
    value: Json | null | undefined
) => {
    console.log('storageXPath ->', storageXPath);

    const allData = indexedDb.getJson(KEY) ?? {};
    const arr = storageXPathToPath(storageXPath);

    set(allData, arr, value);

    indexedDb.setJson(KEY, allData);
};

export const patchXPath = (storageXPath: StorageXPath, change: Json) => {
    const data = getXPath(storageXPath);

    console.log('storageXPath ->', storageXPath);

    const newData = {
        ...data,
        ...change,
    };

    setXPath(storageXPath, newData);
};

export const deleteXPath = (storageXPath: StorageXPath) => {
    console.log('storageXPath ->', storageXPath);

    setXPath(storageXPath, undefined);
};

export const getByPredicate = (
    key: string,
    predicate: (item: Json) => boolean
) => {
    const allData = indexedDb.getJson(KEY) || {};
    const nodeData: Json = allData[key] || {};
    return Object.values(nodeData).filter(predicate);
};

export const deleteByPredicate = (
    key: string,
    predicate: (item: Json) => boolean
) => {
    const allData = indexedDb.getJson(KEY) || {};
    const nodeData: Json = allData[key] || {};

    const items = getByPredicate(key, predicate);
    const itemIds = items.map((item) => item.id);

    itemIds.forEach((id) => delete nodeData[id]);

    indexedDb.setJson(KEY, allData);
};

export const storageXPathToPath = (storageXPath: StorageXPath) => {
    const { key, xpath } = storageXPath;
    const arr = [key];

    if (xpath) {
        arr.push(xpath);
    }

    return arr;
};
