import { Json } from 'redux-connected-types';
import {
    getIndex,
    parsePath,
    getSubitemsNodeName,
    getPathType,
    uuidv4,
} from 'rc-adapter-base';

export type FsClientConfiguration = {
    dbPath: string;
    fs: any;
};

interface IFsClient {
    get: (path: string, params?: Json) => void;
    patch: (path: string, change: Json) => void;
    set: (path: string, value: Json) => void;
    add: (path: string, item: Json) => void;
    delete: (path: string) => void;
    reloadDataFromDisk: () => void;
}

export class FsClient implements IFsClient {
    private data: Json = {};

    constructor(private config: FsClientConfiguration) {
        this.reloadDataFromDisk();
    }

    single = {
        get: (path: string) => {
            let { id, nodeName } = parsePath(path);
            let output = this.data[nodeName];

            if (id) {
                return output.find((item) => item.id === id);
            } else {
                return output;
            }
        },
        set: (path: string, value: Json) => {
            let { id, nodeName } = parsePath(path);

            if (id) {
                const index = getIndex(path, this.data);
                this.data[nodeName][index] = value;
            } else {
                this.data[nodeName] = value;
            }

            this.saveDataToDisk();
        },
        patch: (path: string, change: Json) => {
            let { id, nodeName } = parsePath(path);

            if (id) {
                const item = this.get(path);
                const index = getIndex(path, this.data);

                this.data[nodeName][index] = {
                    ...item,
                    ...change,
                };
            } else {
                this.data[nodeName] = {
                    ...this.data[nodeName],
                    ...change,
                };
            }
            this.saveDataToDisk();
        },
        delete: (path: string) => {
            let { nodeName, id } = parsePath(path);

            if (id) {
                const index = getIndex(path, this.data);
                this.data[nodeName].splice(index, 1);
            } else {
                delete this.data[nodeName];
            }

            this.saveDataToDisk();
        },
    };

    subItem = {
        get: (path: string, params?: Json) => {
            let { id: parentId, subItemId } = parsePath(path);

            const itemsNodeName = getSubitemsNodeName(path);

            if (!subItemId) {
                return this.collection.get(path, {
                    itemsNodeName,
                    parentId,
                    parentIdFieldName: 'chatId',
                });
            } else {
                return this.single.get(`/${itemsNodeName}/${subItemId}`);
            }
        },
        set: (path: string, value: Json) => {
            let { subItemId } = parsePath(path);
            const nodeName = getSubitemsNodeName(path);
            return this.single.set(`/${nodeName}/${subItemId}`, value);
        },
        patch: (path: string, value: Json) => {
            let { subItemId } = parsePath(path);
            const nodeName = getSubitemsNodeName(path);
            return this.single.patch(`/${nodeName}/${subItemId}`, value);
        },
        delete: (path: string) => {
            let { subItemId } = parsePath(path);
            const nodeName = getSubitemsNodeName(path);
            return this.single.delete(`/${nodeName}/${subItemId}`);
        },
    };

    collection = {
        get: (path: string, params: Json = {}) => {
            const { itemsNodeName, parentId, parentIdFieldName } = params;
            let { nodeName, hasItems } = parsePath(path);
            let output = this.data[nodeName];

            if (hasItems) {
                output = this.data[itemsNodeName].filter(
                    (item) => item[parentIdFieldName] === parentId
                );
            }

            return output;
        },
        set: (path: string, items: Json) => {
            const { nodeName } = parsePath(path);
            this.data[nodeName] = items;
            this.saveDataToDisk();
        },
        add: (path: string, item: Json) => {
            const newItem = { ...item };
            const { nodeName } = parsePath(path);

            if (!newItem.id) {
                newItem.id = uuidv4();
            }

            this.data[nodeName].push(item);
            this.saveDataToDisk();
        },
        pop: (path: string) => {
            const { nodeName } = parsePath(path);
            this.data[nodeName].pop();

            this.saveDataToDisk();
        },
        delete: (path: string) => {},
    };

    get(path: string, params?: Json) {
        switch (getPathType(path, this.data)) {
            case 'SINGLE':
                return this.single.get(path);
            case 'COLLECTION':
                return this.collection.get(path, params);
            case 'SUBITEM':
                return this.subItem.get(path, params);
        }
    }

    patch(path: string, change: Json) {
        switch (getPathType(path, this.data)) {
            case 'SINGLE':
                return this.single.patch(path, change);
            case 'SUBITEM':
                return this.subItem.patch(path, change);
        }
    }

    set(path: string, value: Json) {
        switch (getPathType(path, this.data)) {
            case 'SINGLE':
                return this.single.set(path, value);
            case 'COLLECTION':
                return this.collection.set(path, value);
            case 'SUBITEM':
                return this.subItem.set(path, value);
        }
    }

    add(path: string, item: Json) {
        this.collection.add(path, item);
    }

    pop(path: string) {
        this.collection.pop(path);
    }

    delete(path: string) {
        switch (getPathType(path, this.data)) {
            case 'SINGLE':
                return this.single.delete(path);
            case 'COLLECTION':
                return this.collection.delete(path);
            case 'SUBITEM':
                return this.subItem.delete(path);
        }
    }

    bulk(crudActions: CrudAction[]) {}

    reloadDataFromDisk() {
        const dataRaw = this.config.fs
            .readFileSync(this.config.dbPath)
            .toString();

        this.data = JSON.parse(dataRaw);
        return this;
    }

    saveDataToDisk() {
        const json = JSON.stringify(this.data, null, 4);
        this.config.fs.writeFileSync(this.config.dbPath, json);
    }
}
