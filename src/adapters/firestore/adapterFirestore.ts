import { FirestoreQueryBuilder } from './FirestoreQueryBuilder';
import { itemsToObject, ts } from 'shared-base';
import { ApiRequest, Adapter, ApiResponse } from '../../types';
import { NodeType } from 'redux-store-generator';
import { ResponseBuilder } from '../_base/ResponseBuilder';
import { FirebaseApp } from 'firebase/app';
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

    POST = async (request: ApiRequest, response: ResponseBuilder) => {
        const { argsNodeName, argsParams = {} } = request;

        let snapshotGet, ref;

        const itemToAdd = this.withDates(argsParams, true, true);

        if (argsParams.id) {
            ref = doc(this.db, argsNodeName, argsParams.id);
            await setDoc(ref, itemToAdd);
            snapshotGet = await getDoc(ref);
        } else {
            ref = collection(this.db, argsNodeName);
            const snapshotAdd = await addDoc(ref, itemToAdd);
            ref = doc(this.db, argsNodeName, snapshotAdd.id);
            snapshotGet = await getDoc(ref);
        }

        const data = snapshotGet.data();
        response.withData(data);

        return {
            data,
        };
    };

    PATCH = (request: ApiRequest, _response: ResponseBuilder) => {
        const { argsPath, argsNodeName, argsParams: data = {} } = request;
        const id = argsPath.split('/').pop();
        const nodeName =
            request.argsNodeType === NodeType.SINGLE_NODE
                ? 'singles'
                : argsNodeName;

        const ref = doc(this.db, nodeName, id || '');
        return setDoc(ref, this.withDates(data, false, true), { merge: true });
    };

    PUT = (request: ApiRequest, _response: ResponseBuilder) => {
        const { argsPath, argsParams: data } = request;
        return Promise.resolve();
    };

    DELETE = async (request: ApiRequest, _response: ResponseBuilder) => {
        const { argsPath, argsNodeName } = request;
        const id = argsPath.split('/').pop();

        const ref = doc(this.db, argsNodeName, id || '');
        await deleteDoc(ref);
    };

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
