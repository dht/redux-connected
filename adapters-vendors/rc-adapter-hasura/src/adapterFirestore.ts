import { Json } from 'redux-store-generator';
import { ResponseBuilder } from '../../../sagas/_utils/ResponseBuilder';
import { ApiRequest, ApiResponse } from '../../../types/types';
const firebase = require('firebase/app');

export type FirestoreServerConfiguration = {
    db: any;
};

export class FirestoreAdapter {
    private instance: any;

    constructor(configuration: FirestoreServerConfiguration) {
        this.instance = configuration.db;
    }

    single_get = (request: ApiRequest): Promise<any> => {
        return this.instance.getSingle(`singles/${request.nodeName}`);
    };

    single_patch = (request: ApiRequest): Promise<any> => {
        return this.instance.update(
            `singles/${request.nodeName}`,
            request.params
        );
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

        const params: GetParams = {
            orderBy: {
                field: 'timestamp',
            },
        };

        return this.instance.getAll(path, params);
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

export class Firestore {
    db: any;
    lastDoc: Record<string, any> = {};

    constructor(public config: any) {
        firebase.initializeApp(config);
        this.db = firebase.firestore();
    }

    getAll = (path: string, getParams: GetParams = {}) => {
        const { limit, orderBy, filters = [], q, isNext } = getParams;

        let pointer = this.db.collection(path);

        if (q) {
            const { field, value } = q;
            pointer = pointer.where(field, '>=', value);
        }

        filters.forEach((filter) => {
            const { field, relation, value } = filter;
            pointer = pointer.where(field, relation, value);
        });

        if (orderBy) {
            const { field, order = 'asc' } = orderBy;
            pointer = pointer.orderBy(field, order);
        }

        if (limit) {
            pointer = pointer.limit(limit);
        }

        const lastDoc = this.lastDoc[path];
        if (isNext && lastDoc) {
            pointer = pointer.startAt(lastDoc);
        }

        return pointer.get().then((snapshot: any) => {
            let data = [] as any,
                lastDoc;

            snapshot.forEach((d: any) => {
                data.push({
                    id: d.id,
                    ...d.data(),
                });

                lastDoc = d;
            });

            this.lastDoc[path] = lastDoc;

            return data;
        });
    };

    next = (path: string, getParams: GetParams = {}) => {
        getParams.isNext = true;
        return this.getAll(path, getParams);
    };

    clearNext = (path: string) => {
        delete this.lastDoc[path];
    };

    getSingle = (path: string): Promise<any> => {
        const ref = this.db.doc(path);

        return ref.get().then((snapshot: any) => {
            if (snapshot.exists) {
                return snapshot.data();
            }
        });
    };

    update = (path: string, change: Json): Promise<any> => {
        return this.db
            .doc(path)
            .update(change)
            .then(() => true);
    };

    add = (path: string, item: Json): Promise<any> => {
        return this.db
            .collection(path)
            .add(item)
            .then((docRef: any) => {
                return { ...item, id: docRef.id };
            });
    };

    pop = async (path: string): Promise<any> => {
        const lastItem = await this.getAll(path, {
            orderBy: {
                field: 'timestamp',
                order: 'desc',
            },
            limit: 1,
        });

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
                order: 'desc',
            },
            limit: 1,
        });

        if (lastItem && lastItem[0].id) {
            return this.deleteSingle(`${path}/${lastItem[0].id}`);
        }
    };

    clearItems = async (path: string) => {
        return this.deleteCollection(path);
    };

    deleteSingle = async (path: string) => {
        return this.db.doc(path).delete();
    };

    deleteCollection = async (collection: any, batchSize: number = 30) => {
        const collectionRef = this.db.collection(collection);
        const query = collectionRef.orderBy('__name__').limit(batchSize);

        return new Promise((resolve, reject) => {
            this.deleteQueryBatch(query, resolve).catch(reject);
        });
    };

    deleteQueryBatch = async (query: any, resolve: any) => {
        const snapshot = await query.get();

        const batchSize = snapshot.size;
        if (batchSize === 0) {
            resolve();
            return;
        }

        // Delete documents in a batch
        const batch = this.db.batch();
        snapshot.docs.forEach((doc: any) => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
            this.deleteQueryBatch(query, resolve);
        });
    };
}
