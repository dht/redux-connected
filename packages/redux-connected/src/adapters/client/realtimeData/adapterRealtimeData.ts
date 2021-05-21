import { Json } from 'redux-store-generator';
import { ResponseBuilder } from '../../../sagas/_utils/ResponseBuilder';
import { ApiRequest, ApiResponse } from '../../../types/types';
const firebase = require('firebase');

export type RealtimeDataServerConfiguration = {
    db: RealtimeData;
};

export class RealtimeDataAdapter {
    private instance: any;

    constructor(configuration: RealtimeDataServerConfiguration) {
        this.instance = configuration.db;
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
        const apiMethod = this[methodName];

        if (typeof apiMethod !== 'function') {
            Promise.resolve(response);
        }

        return apiMethod(request)
            .then((data: any) => {
                console.log('data ->', request, data);
                response.withData(data).withIsSuccess(true).withData(data);
                return response.build();
            })
            .catch((error) => {
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

export class RealtimeData {
    db: any;

    constructor(public config: any) {
        firebase.initializeApp(config, 'database');
        this.db = firebase.database();
    }

    getAll = (path: string, getParams: GetParams = {}) => {
        const { limit, orderBy, filters = [], q, isNext } = getParams;

        console.log('path ->', path);

        let pointer = this.db.ref(path),
            isOrdered = false;

        if (q) {
            const { field } = q;
            console.warn(
                `search query on ${field} is not supported in realtime database`
            );
        }

        filters.forEach((filter) => {
            const { field, relation, value } = filter;
            if (relation !== '==') {
                console.warn(
                    `${relation} relation on ${field} is not supported in realtime database`
                );
            } else {
                console.log('field, value ->', field, value);
                pointer = pointer.orderByChild(field).equalTo(value);
                isOrdered = true;
            }
        });

        if (orderBy) {
            if (isOrdered) {
                console.warn(
                    `collection is already ordered and cannot be sorted again`
                );
            } else {
                const { field, order = 'asc' } = orderBy;
                console.log('order ->', field, order);

                if (order === 'desc') {
                    console.warn(
                        `desc order on ${field} is not supported in realtime database`
                    );
                }
                pointer = pointer.orderByChild(field);
            }
        }

        if (limit) {
            if (limit > 0) {
                pointer = pointer.limitToFirst(limit);
            } else {
                pointer = pointer.limitToLast(Math.abs(limit));
            }
        }

        if (isNext) {
        }

        return pointer.get().then((snapshot) => {
            console.log('snapshot.val() ->', snapshot.val());
            return objectToArray(snapshot.val());
        });
    };

    next = (path: string, getParams: GetParams = {}) => {
        getParams.isNext = true;
        return this.getAll(path, getParams);
    };

    clearNext = (_path: string) => {};

    getSingle = (path: string): Promise<any> => {
        const ref = this.db.ref(path);

        console.log('path ->', path);

        return ref.get().then((snapshot) => {
            return snapshot.val();
        });
    };

    update = (path: string, change: Json): Promise<any> => {
        return this.db
            .ref(path)
            .update(change)
            .then(() => true);
    };

    add = (path: string, item: Json): Promise<any> => {
        const ref = this.db.ref(path).push(item);

        return ref.set(item).then(() => {
            return { ...item, id: ref.key };
        });
    };

    pop = async (path: string): Promise<any> => {
        console.log('path ->', path);

        const lastItem = await this.getAll(path, {
            orderBy: {
                field: 'timestamp',
            },
            limit: -1,
        });

        console.log('lastItem ->', lastItem);

        if (lastItem && lastItem[0].id) {
            return this.deleteSingle(`${path}/${lastItem[0].id}`);
        }
    };

    clear = (path: string): Promise<any> => {
        return this.deleteCollection(path);
    };

    popItem = async (path: string) => {
        const lastItem = await this.getAll(path, {
            orderBy: {
                field: 'timestamp',
            },
            limit: -1,
        });

        if (lastItem && lastItem[0].id) {
            return this.deleteSingle(`${path}/${lastItem[0].id}`);
        }
    };

    clearItems = async (path: string) => {
        return this.deleteCollection(path);
    };

    deleteSingle = async (path: string) => {
        return this.db.ref(path).remove();
    };

    deleteCollection = async (collection) => {
        const collectionRef = this.db.ref(collection);
        return collectionRef.remove();
    };
}

const objectToArray = (object: Record<string, Json>): Json[] => {
    return Object.keys(object || {}).map((id) => {
        return {
            id,
            ...object[id],
        };
    });
};
