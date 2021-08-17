import { ResponseBuilder } from 'rc-adapter-base';
import { ApiRequest, ApiResponse } from 'rc-adapter-base';
import { Json } from 'redux-store-generator';
import nodePath from 'path';
import { uuidv4 } from 'rc-adapter-base';

export type FsAdapterConfiguration = {
    dbPath: string;
    fs: any;
};

export class FsAdapter {
    private instance: any;

    constructor(configuration: FsAdapterConfiguration) {
        this.instance = new FsDirectories(configuration);
        console.log('1 ->', 1);
        this.instance.load();
    }

    single_get = (request: ApiRequest): Promise<any> => {
        return this.instance.getSingle(request.nodeName);
    };

    single_patch = (request: ApiRequest): Promise<any> => {
        return this.instance.update(request.nodeName, request.params);
    };

    queue_get = (request: ApiRequest): Promise<any> => {
        return this.instance.getAll(request.nodeName);
    };

    queue_push = (request: ApiRequest): Promise<any> => {
        const { params = {} } = request;
        const { item = {} } = params;

        return this.instance.add(request.nodeName, item);
    };

    queue_pop = (request: ApiRequest): Promise<any> => {
        console.log('1 ->', 1);
        return this.instance.pop(request.nodeName);
    };

    queue_clear = (request: ApiRequest): Promise<any> => {
        return this.instance.clear(request.nodeName);
    };

    collection_get = (request: ApiRequest): Promise<any> => {
        return this.instance.getAll(request.nodeName, request.params);
    };

    collection_add = (request: ApiRequest): Promise<any> => {
        const { params = {} } = request;
        const { item = {} } = params;

        return this.instance.add(request.nodeName, item);
    };

    collection_patch = (request: ApiRequest): Promise<any> => {
        const { params = {}, path } = request;
        const { change = {} } = params;
        return this.instance.update(path, change);
    };

    collection_delete = (request: ApiRequest): Promise<any> => {
        const { path } = request;
        return this.instance.deleteSingle(path);
    };

    collection_clear = (request: ApiRequest): Promise<any> => {
        return this.instance.deleteCollection(request.nodeName);
    };

    grouped_list_get = (request: ApiRequest): Promise<any> => {
        return this.instance.getAll(request.nodeName);
    };

    grouped_list_add = (request: ApiRequest): Promise<any> => {
        const { params = {} } = request;
        const { item = {} } = params;

        return this.instance.add(request.nodeName, item);
    };

    grouped_list_patch = (request: ApiRequest): Promise<any> => {
        const { params = {}, path } = request;
        const { change = {} } = params;
        return this.instance.update(path, change);
    };

    grouped_list_delete = (request: ApiRequest): Promise<any> => {
        const { path } = request;
        return this.instance.deleteSingle(path);
    };

    grouped_list_clear = (request: ApiRequest): Promise<any> => {
        return this.instance.deleteCollection(request.nodeName);
    };

    grouped_list_getItems = (request: ApiRequest): Promise<any> => {
        const { path } = request;

        const parts = this.parsePath(path);

        console.log('path ->', parts);

        const params: GetParams = {
            filters: [
                {
                    field: 'parentId',
                    relation: '==',
                    value: parts.id,
                },
            ],
            orderBy: {
                field: 'timestamp',
            },
        };

        return this.instance.getAll(`${parts.nodeName}Items`, params);
    };

    grouped_list_pushItem = (request: ApiRequest): Promise<any> => {
        const { path, params = {} } = request;
        const { item } = params;
        return this.instance.add(path, item);
    };

    grouped_list_popItem = (request: ApiRequest): Promise<any> => {
        const { path } = request;
        return this.instance.popItem(path);
    };

    grouped_list_clearItems = (request: ApiRequest): Promise<any> => {
        const { path } = request;
        return this.instance.clearItems(path);
    };

    parsePath = (path: string) => {
        const parts = path.split('/');
        parts.shift();

        const nodeName = parts.shift();
        const id = parts.shift() || '';

        return {
            nodeName,
            id,
        };
    };

    fireRequest = (request: ApiRequest): Promise<ApiResponse> => {
        const response = new ResponseBuilder(request);
        const type = request.nodeType.toLocaleLowerCase().replace('_node', '');
        const methodName = `${type}_${request.apiVerb}`;
        const apiMethod = (this as any)[methodName];

        if (typeof apiMethod !== 'function') {
            Promise.resolve(response);
        }

        return apiMethod(request)
            .then((data: any) => {
                console.log('data ->', request, data);
                response.withData(data).withIsSuccess(true).withData(data);
                return response.build();
            })
            .catch((error: any) => {
                console.log('Error getting documents: ', error);
                return response.build();
            });
    };
}

type Order = 'asc' | 'desc';

type Relation = '==' | '<=' | '<' | '>' | '>=' | '!=';

type Filter = {
    field: string;
    relation: Relation;
    value: string | number | boolean;
};

export type GetParams = {
    q?: {
        field: string;
        value: any;
    };
    orderBy?: {
        field: string;
        order?: Order;
    };
    filters?: Filter[];
    limit?: number;
    isNext?: boolean;
};

export class FsDirectories {
    fs: any;
    fsExtra: any;
    dbPath: string = '';
    refPath: string[] = [];
    data: any = {};

    constructor(public config: any) {
        this.fs = config.fs;
        this.dbPath = config.dbPath;
        this.refPath = config.refPath || [];
        this.fsExtra = new FsExtra(config);
    }

    get key() {
        const len = this.refPath.length - 1;
        return this.refPath[len];
    }

    load = () => {
        this.data = {};
    };

    save = () => {};

    get pointer() {
        let pointer = this.data;
        const p = [...this.refPath];
        const key = p.pop();

        p.forEach((node: string) => {
            if (!pointer[node]) {
                pointer[node] = {};
            }

            pointer = pointer[node];
        });

        return {
            pointer,
            key,
        };
    }

    ref = (nodeName: string): FsDirectories => {
        const refPath = [...this.refPath, nodeName];

        const newInstance = new FsDirectories({
            ...this.config,
            refPath,
        });

        newInstance.data = this.data;
        return newInstance;
    };

    generatePath = () => {
        const path = this.refPath.join('/');
        return `${this.dbPath}/${path}.json`;
    };

    set = (data: Json) => {
        const { pointer, key } = this.pointer;

        if (key) {
            pointer[key] = data;
            const filepath = this.generatePath();
            this.fsExtra.writeJsonSyncP(filepath, data);
        }
    };

    getAll = (_path: string, getParams: GetParams = {}) => {
        const { limit, orderBy, filters = [], q, isNext } = getParams;

        // let pointer = this.ref(path);

        if (q) {
            // const { field } = q;
        }

        filters.forEach((_filter) => {
            // const { field, relation, value } = filter;
        });

        if (orderBy) {
            const { field, order = 'asc' } = orderBy;
            console.log('order ->', field, order);
        }

        if (limit) {
        }

        if (isNext) {
        }

        return;
    };

    remove = () => {
        if (this.refPath.length === 1) {
            const nodeName = this.refPath[0];
            delete this.data[nodeName];
            this.fsExtra.rmdirSync(`${this.dbPath}/${nodeName}`, true);
        }
    };

    push = () => {
        const id = uuidv4();
        return this.ref(id);
    };

    update = (_path: string, _change: Json): Promise<any> => {
        return Promise.resolve(true);
    };

    add = (_path: string, _item: Json): Promise<any> => {
        return Promise.resolve(true);
    };

    pop = async (_path: string): Promise<any> => {};

    clear = (path: string): Promise<any> => {
        return this.deleteCollection(path);
    };

    popItem = async (_path: string) => {};

    clearItems = async (path: string) => {
        return this.deleteCollection(path);
    };

    getSingle = (nodeName: string) => {
        return Promise.resolve(this.data[nodeName]);
    };

    deleteSingle = async (_path: string) => {};

    deleteCollection = async (_collection: any) => {};
}

export class FsExtra {
    fs: any;

    constructor(public config: any) {
        this.fs = config.fs;
    }

    mkdirSync(path: string, recursive: boolean = true) {
        this.fs.mkdirSync(path, { recursive });
    }

    rmdirSync(path: string, force: boolean = false) {
        this.fs.rmdirSync(path, { recursive: force });
    }

    writeFileSyncP(filepath: string, content: string) {
        const { dir } = nodePath.parse(filepath);
        this.mkdirSync(dir, true);
        this.fs.writeFileSync(filepath, content);
    }

    writeJsonSyncP(filepath: string, content: Json) {
        this.writeFileSyncP(filepath, JSON.stringify(content, null, 4));
    }

    readJsonOrRawSync(filepath: string) {
        const content = this.fs.readFileSync(filepath);

        try {
            return JSON.parse(content);
        } catch (e) {}

        return content;
    }

    lsSync(path: string, recursive: boolean = false, withContent: boolean) {
        const items = this.fs.readdirSync(path);

        return items.map((item: any) => {
            const itemPath = path + '/' + item;
            const isDirectory = this.fs.lstatSync(itemPath).isDirectory();
            const isFile = this.fs.lstatSync(itemPath).isFile();

            const output = {
                path: itemPath,
                isDir: isDirectory,
            } as any;

            if (isDirectory) {
                output.children = recursive
                    ? this.lsSync(itemPath, true, withContent)
                    : [];
            }

            if (isFile && withContent) {
                output.content = this.readJsonOrRawSync(itemPath);
            }

            return output;
        });
    }
}

// const _objectToArray = (object: Record<string, Json>): Json[] => {
//     return Object.keys(object || {}).map((id) => {
//         return {
//             id,
//             ...object[id],
//         };
//     });
// };
