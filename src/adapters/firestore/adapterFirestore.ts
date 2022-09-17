import { Adapter, ApiRequest, ApiResponse } from '../../types';
import { FirebaseApp } from 'firebase/app';
import { FirestoreQueryBuilder } from './FirestoreQueryBuilder';
import { guid, guid4 } from 'shared-base';
import { itemsToObject, ts } from 'shared-base';
import { NodeType } from 'redux-store-generator';
import { ResponseBuilder } from '../_base/ResponseBuilder';
import {
    getFirestore,
    collection,
    getDocs,
    setDoc,
    getDoc,
    deleteDoc,
    doc,
    addDoc,
    writeBatch,
    Firestore,
    query,
    where,
} from 'firebase/firestore/lite';

export class FirestoreAdapter implements Adapter {
    private db: Firestore;

    constructor(app: FirebaseApp) {
        this.db = getFirestore(app);
    }

    GET = async (
        request: ApiRequest,
        response: ResponseBuilder
    ): Promise<FirestoreResponse> => {
        const firebaseQuery = new FirestoreQueryBuilder()
            .withApiRequest(request)
            .withDb(this.db)
            .build();

        const snapshot = await getDocs(firebaseQuery);

        const data = snapshot.docs.map((doc) => doc.data());

        response.withData(data);

        return {
            data,
        };
    };

    POST_main = async (request: ApiRequest, response: ResponseBuilder) => {
        const { argsNodeName, argsParams: data = {} } = request;

        this._logRequest(request);

        let snapshotGet, ref, itemToAdd;

        const { id } = data;

        itemToAdd = this.withDates(data, true, true);

        if (id) {
            ref = doc(this.db, argsNodeName, id);
            await setDoc(ref, itemToAdd);
            snapshotGet = await getDoc(ref);
        } else {
            ref = collection(this.db, argsNodeName);
            const snapshotAdd = await addDoc(ref, itemToAdd);
            ref = doc(this.db, argsNodeName, snapshotAdd.id);
            snapshotGet = await getDoc(ref);
        }

        const getData = snapshotGet.data();
        response.withData(getData);

        return {
            data: getData,
        };
    };

    POST_sub = async (request: ApiRequest, response: ResponseBuilder) => {
        const { argsNodeName, argsParams: data = {} } = request;

        let snapshotGet, ref, itemToAdd;

        const { id } = data;
        const { id: itemId = guid4() } = data.items[0];

        itemToAdd = this.withDates(data.items[0], true, true);

        if (itemId) {
            ref = doc(this.db, argsNodeName, id, 'items', itemId);
            await setDoc(ref, itemToAdd);
            snapshotGet = await getDoc(ref);
        } else {
            ref = collection(this.db, argsNodeName, id, 'items');
            const snapshotAdd = await addDoc(ref, itemToAdd);
            ref = doc(this.db, argsNodeName, id, 'items', snapshotAdd.id);
            snapshotGet = await getDoc(ref);
        }

        const getData = snapshotGet.data();

        response.withData(getData);

        return {
            data: getData,
        };
    };

    POST_withItems = async (request: ApiRequest, response: ResponseBuilder) => {
        const { argsNodeName, argsParams: data = {} } = request;

        let snapshotGet, ref, itemToAdd, listItemToAdd;

        const { id = guid4(), items = [] } = data;

        itemToAdd = this.withDates(data, true, true);
        delete itemToAdd['items'];
        ref = doc(this.db, argsNodeName, id);
        await setDoc(ref, itemToAdd);

        const batch = writeBatch(this.db);

        items.forEach((item: any) => {
            const { id: itemId = guid4() } = item;
            listItemToAdd = this.withDates(item, true, true);
            const ref = doc(this.db, argsNodeName, id, 'items', itemId);
            batch.set(ref, listItemToAdd);
        });

        await batch.commit();

        snapshotGet = await getDoc(ref);

        const getData = snapshotGet.data();
        response.withData(getData);

        return {
            data: getData,
        };
    };

    POST = async (request: ApiRequest, response: ResponseBuilder) => {
        const { argsApiVerb, argsParams: data = {} } = request;

        if (argsApiVerb === 'pushItem') {
            return this.POST_sub(request, response);
        } else if (data.items) {
            return this.POST_withItems(request, response);
        } else {
            return this.POST_main(request, response);
        }
    };

    PATCH = async (request: ApiRequest, response: ResponseBuilder) => {
        const { argsNodeName, argsApiVerb, argsParams } = request;

        const data = { ...argsParams };

        const { id, itemId } = data;

        let snapshotGet;

        if (!id) {
            return Promise.resolve(false);
        }

        const nodeName =
            request.argsNodeType === NodeType.SINGLE_NODE
                ? 'singles'
                : argsNodeName;

        let ref;

        if (argsApiVerb === 'patchItem') {
            data['id'] = data['itemId'];
            delete data['itemId'];
            ref = doc(this.db, argsNodeName, id, 'items', itemId);
        } else {
            ref = doc(this.db, nodeName, id);
        }

        await setDoc(ref, this.withDates(data, false, true), { merge: true });

        snapshotGet = await getDoc(ref);

        const getData = snapshotGet.data();
        response.withData(getData);

        return {
            data: getData,
        };
    };

    PUT = (request: ApiRequest, _response: ResponseBuilder) => {
        const { argsParams: data } = request;
        return Promise.resolve();
    };

    DELETE_withItems = async (
        request: ApiRequest,
        _response: ResponseBuilder
    ) => {
        const { argsNodeName, argsParams: data = {} } = request;
        const { id = '' } = data;

        let ref;

        if (!id) {
            return Promise.resolve(false);
        }
        ref = collection(this.db, argsNodeName, id, 'items');

        const snapshot = await getDocs(ref);
        const items = snapshot.docs.map((doc) => doc.data());

        const itemIds = items.map((i) => i.id);

        const batch = writeBatch(this.db);
        ref = doc(this.db, argsNodeName, id);
        batch.delete(ref);

        itemIds.forEach((itemId) => {
            ref = doc(this.db, argsNodeName, id, 'items', itemId);
            batch.delete(ref);
        });

        await batch.commit();

        return {};
    };

    DELETE = async (request: ApiRequest, _response: ResponseBuilder) => {
        const { argsApiVerb, argsNodeType } = request;

        const { argsNodeName, argsParams } = request;
        const { id = '', itemId = '' } = argsParams || {};

        if (!id) {
            return Promise.resolve(false);
        }

        let ref = doc(this.db, argsNodeName, id);

        if (argsNodeType === 'GROUPED_LIST_NODE') {
            if (argsApiVerb === 'deleteItem') {
                ref = doc(this.db, argsNodeName, id, 'items', itemId);
            } else {
                return this.DELETE_withItems(request, _response);
            }
        }

        await deleteDoc(ref);
    };

    _logRequest(request: ApiRequest) {
        console.log(JSON.stringify(request, null, 4));
    }

    parseReturnedData(request: ApiRequest, res: FirestoreResponse) {
        const { data } = res;

        if (request.argsMethod === 'GET') {
            switch (request.argsNodeType) {
                case NodeType.SINGLE_NODE:
                    return data[0];
                case NodeType.COLLECTION_NODE:
                    return itemsToObject(
                        data,
                        request.argsParams?.page || 1,
                        request.argsParams?.limit
                    );
                case NodeType.GROUPED_LIST_NODE:
                    if (request.argsApiVerb === 'getItems') {
                        return data;
                    }

                    return itemsToObject(
                        data,
                        request.argsParams?.page || 1,
                        request.argsParams?.limit
                    );
                default:
                    return data;
            }
        } else {
            return data;
        }
    }

    fireRequest = (request: ApiRequest): Promise<ApiResponse> => {
        const response = new ResponseBuilder(request);

        const apiMethod = this[request.argsMethod];

        if (typeof apiMethod !== 'function') {
            Promise.resolve(response);
        }

        return new Promise((resolve) => {
            apiMethod(request, response)
                .then((_res: any) => {
                    const res = _res as FirestoreResponse;
                    response.withIsSuccess(true).withFirestoreResponse(res);
                    const data = this.parseReturnedData(request, res);
                    response.withData(data);

                    resolve(response.build());
                })
                .catch(function (error: any) {
                    response
                        .withErrorType('javascript')
                        .withErrorMessage(error.message);

                    resolve(response.build());
                });
        });
    };

    withDates(data: Json, withCreatedDate: boolean, withModifiedDate: boolean) {
        let output = { ...data };

        if (withCreatedDate) {
            output = { ...output, _createdDate: ts() };
        }

        if (withModifiedDate) {
            output = { ...output, _modifiedDate: ts() };
        }

        return output;
    }
}

export type FirestoreResponse = {
    data: Json[];
};
