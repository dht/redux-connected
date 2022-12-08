import { Json } from '../../types';
import { get, set } from 'shared-base';
import { StorageXPath } from './LocalStorageQueryBuilder';

interface Storage {
    getJson: (key: string) => Json | null;
    setJson: (key: string, json: Json) => void;
}

let storage: Storage = {
    getJson: () => null,
    setJson: () => {},
};

export const KEY = 'LOCAL_DATA_KEY';

export const initStorage = (value: Storage) => {
    storage = value;
};

export const getXPath = (storageXPath: StorageXPath) => {
    const allData = storage.getJson(KEY) ?? {};
    const arr = storageXPathToPath(storageXPath);
    return get(allData, arr);
};

export const setXPath = (
    storageXPath: StorageXPath,
    value: Json | null | undefined
) => {
    const allData = storage.getJson(KEY) ?? {};
    const arr = storageXPathToPath(storageXPath);

    set(allData, arr, value);

    storage.setJson(KEY, allData);
};

export const patchXPath = (storageXPath: StorageXPath, change: Json) => {
    const data = getXPath(storageXPath);

    const newData = {
        ...data,
        ...change,
    };

    setXPath(storageXPath, newData);
};

export const deleteXPath = (storageXPath: StorageXPath) => {
    setXPath(storageXPath, undefined);
};

export const getByPredicate = (
    key: string,
    predicate: (item: Json) => boolean
) => {
    const allData = storage.getJson(KEY) || {};
    const nodeData: Json = allData[key] || {};
    return Object.values(nodeData).filter(predicate);
};

export const deleteByPredicate = (
    key: string,
    predicate: (item: Json) => boolean
) => {
    const allData = storage.getJson(KEY) || {};
    const nodeData: Json = allData[key] || {};

    const items = getByPredicate(key, predicate);
    const itemIds = items.map((item) => item.id);

    itemIds.forEach((id) => delete nodeData[id]);

    storage.setJson(KEY, allData);
};

export const storageXPathToPath = (storageXPath: StorageXPath) => {
    const { key, xpath } = storageXPath;
    const arr = [key];

    if (xpath) {
        arr.push(xpath);
    }

    return arr;
};
