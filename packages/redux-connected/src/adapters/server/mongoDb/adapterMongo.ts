import { Json } from 'redux-store-generator';
import { ResponseBuilder } from '../../../sagas/_utils/ResponseBuilder';
import { ApiRequest, ApiResponse } from '../../../types/types';

export type MongoDbServerConfiguration = {
    client: MongoDbClient;
};

export class MongoDbAdapter {
    private instance: any;

    constructor(config: MongoDbServerConfiguration) {
        this.instance = config.client;
    }

    connect() {
        return this.instance.connect();
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

export class MongoDbClient {
    private db: any;
    private refPath: string[];

    constructor(public config: any) {
        this.refPath = config.refPath || [];
    }

    connect = async () => {
        const MongoClient = this.config.MongoClient;
        const client = new MongoClient(this.config.url);
        return client.connect().then(() => {
            console.log('this.refPath ->', this.refPath);

            this.db = client.db(this.config.dbName);
        });
    };

    ref = (nodeName: string): MongoDbClient => {
        const refPath = [...this.refPath, nodeName];

        const newInstance = new MongoDbClient({
            ...this.config,
            refPath,
        });

        newInstance.db = this.db;

        return newInstance;
    };

    generatePath = () => {
        const path = this.refPath.join('/');
        return path;
    };

    push = (data: Json) => {
        const path = this.generatePath();
        const collection = this.db.collection(path);
        return collection.insertOne(data);
    };

    remove = (): Promise<any> => {
        const path = this.generatePath();
        console.log('path ->', path);

        const collection = this.db.collection(path);

        return collection.deleteMany({});
    };

    set = (data: Json, isSingle?: boolean): Promise<any> => {
        const path = this.generatePath();

        let collection, query;

        if (isSingle) {
            collection = this.db.collection('singles');
            query = { id: path };
        }

        console.log('isSingle ->', isSingle, query, data);
        const options = { upsert: true };
        return collection.updateOne(query, { $set: data }, options);
    };
}
