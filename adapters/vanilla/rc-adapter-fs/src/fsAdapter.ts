import { ApiRequest, ApiResponse } from 'redux-connected-types';
import { Json } from 'redux-store-generator';
import { ResponseBuilder } from 'rc-adapter-base';
import path from 'path';

export type FsAdapterConfiguration = {
    dbPath: string;
    fs: any;
};

export class FsAdapter {
    private instance: any;

    constructor(configuration: FsAdapterConfiguration) {
        this.instance = new FS(configuration);
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
                response.withData(data).withIsSuccess(true).withData(data);
                return response.build();
            })
            .catch((error: any) => {
                return response.build();
            });
    };
}

export class FS {
    private fs: any;
    private dbPath: string = '';
    private refPath: string[] = [];
    private data: any = {};

    constructor(public config: any) {
        this.fs = config.fs;
        this.dbPath = config.dbPath;
        this.refPath = config.refPath || [];
    }

    get key() {
        const len = this.refPath.length - 1;
        return this.refPath[len];
    }

    readJson = (filePath: string) => {
        const content = this.fs.readFileSync(filePath).toString();
        return JSON.parse(content);
    };

    writeJson = (filePath: string, content: Json) => {
        this.fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
    };

    load = () => {
        const p = path.resolve(this.dbPath);
        this.data = this.readJson(this.dbPath);
    };

    save = () => {
        this.writeJson(this.dbPath, this.data);
    };

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

    ref = (nodeName: string): FS => {
        const refPath = [...this.refPath, nodeName];

        const newInstance = new FS({
            ...this.config,
            refPath,
        });

        newInstance.data = this.data;
        return newInstance;
    };

    set = (data: Json) => {
        const { pointer, key } = this.pointer;

        if (key) {
            pointer[key] = data;
            this.save();
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
            this.save();
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

// const _objectToArray = (object: Record<string, Json>): Json[] => {
//     return Object.keys(object || {}).map((id) => {
//         return {
//             id,
//             ...object[id],
//         };
//     });
// };
