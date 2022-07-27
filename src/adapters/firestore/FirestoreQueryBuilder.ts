import { ApiRequest } from '../../types';
import {
    query,
    collection,
    Query,
    where,
    QueryConstraint,
    Firestore,
} from 'firebase/firestore/lite';

export type QueryConfig = {
    constrains: QueryConstraint[];
};

export class FirestoreQueryBuilder {
    private queryConfig: QueryConfig = {
        constrains: [],
    };
    private apiRequest?: ApiRequest;
    private db?: Firestore;

    constructor() {}

    withDb(db: Firestore) {
        this.db = db;
        return this;
    }

    withApiRequest(apiRequest: ApiRequest) {
        this.apiRequest = apiRequest;
        return this;
    }

    build(): Query<any> {
        const { argsNodeName, argsNodeType } = this.apiRequest!;
        let collectionName;

        if (argsNodeType === 'SINGLE_NODE') {
            collectionName = 'singles';
            this.queryConfig.constrains.push(where('id', '==', argsNodeName));
        } else {
            collectionName = argsNodeName;
        }

        const ref = collection(this.db!, collectionName);
        return query.apply(this, [ref, ...this.queryConfig.constrains]);
    }
}
