import { Json } from 'redux-connected-types';

export const toArray = <T = Json>(objectOrArray: T | T[]): T[] => {
    if (!objectOrArray) {
        return [];
    }
    return Array.isArray(objectOrArray) ? objectOrArray : [objectOrArray];
};

export const isEmpty = (object: Json | any[]) => {
    if (Array.isArray(object)) {
        return object.length === 0;
    }

    return Object.keys(object || {}).length === 0;
};

export const itemsToObject = (items: any[]) => {
    return items.reduce((output, item) => {
        output[item.id] = item;
        return output;
    }, {} as any);
};
