import { Fetch } from './fetch';

const api = new Fetch('http://localhost:4756');

export const resetServer = (data) => {
    let promises: any[] = [];

    Object.keys(data).forEach((nodeName) => {
        const value = data[nodeName];

        if (Array.isArray(value)) {
            promises.push(setCollection(nodeName, value));
        } else {
            promises.push(setSingle(nodeName, value));
        }
    });

    return Promise.all(promises);
};

const deleteCollection = async (nodeName) => {
    const items = await api.get(`/${nodeName}`);

    const promises = items.map((item) => {
        return api.delete(`/${nodeName}/${item.id}`);
    });

    return Promise.all(promises);
};

const setCollection = async (nodeName, items) => {
    await deleteCollection(nodeName);

    const promises = items.map((item) => {
        return api.post(`/${nodeName}`, item);
    });

    return Promise.all(promises);
};

const setSingle = (nodeName, item) => {
    return api.put(`/${nodeName}`, item);
};
