import { Json } from 'redux-connected-types';

export type ResourceInfo = {
    nodeName: string;
    id: string;
    subItemId?: string;
    hasItems?: boolean;
    index?: number;
    item?: Json;
};

export const parsePath = (path: string): ResourceInfo => {
    const parts = path.split('/');
    const hasItems = parts[3] === 'items';

    return {
        nodeName: parts[1],
        id: parts[2],
        hasItems,
        subItemId: hasItems ? parts[4] : undefined,
    };
};

export const getIndex = (path: string, data: Json) => {
    let { id, nodeName, subItemId } = parsePath(path);

    if (subItemId) {
        nodeName = getSubitemsNodeName(path);
        id = subItemId;
    }

    const array = data[nodeName];
    return array.findIndex((item) => item.id === id);
};

export const toSingle = (name: string) => {
    return name.replace(/e?s$/, '');
};

export const getSubitemsNodeName = (path: string) => {
    const { nodeName } = parsePath(path);
    const single = toSingle(nodeName);
    return `${single}Items`;
};

export const getSubitemsParentFieldName = (path: string) => {
    const { nodeName } = parsePath(path);
    const single = toSingle(nodeName);
    return `${single}Id`;
};

export const getSubitems = (path: string, data: Json) => {
    const itemsNodeName = getSubitemsNodeName(path);
    return data[itemsNodeName];
};

export const getSubitemIndex = (path: string, data: Json) => {
    const { id, nodeName } = parsePath(path);
    const array = data[nodeName];
    return array.findIndex((item) => item.id === id);
};

export type PathType = 'SINGLE' | 'COLLECTION' | 'SUBITEM';

export const getPathType = (path: string, data: Json): PathType => {
    const { id, nodeName, hasItems } = parsePath(path);
    const root = data[nodeName];

    if (hasItems) {
        return 'SUBITEM';
    }

    if (id) {
        return 'SINGLE';
    }

    return isQueue(root) || isCollection(root) ? 'COLLECTION' : 'SINGLE';
};

export const isQueue = (data: Json) => {
    return Array.isArray(data);
};

export const isCollection = (data: Json) => {
    if (typeof data !== 'object') {
        return false;
    }

    const firstKey = Object.keys(data)[0];
    const firstValue = data[firstKey];

    return (
        typeof firstValue === 'object' &&
        firstValue['id'] &&
        firstValue['id'] === firstKey
    );
};
