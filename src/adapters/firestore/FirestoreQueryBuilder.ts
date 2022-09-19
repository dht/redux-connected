import { ApiRequest } from '../../types';
import {
    firebase,
    Firestore,
    Query,
    QueryConstraint,
} from './firebase.methods';
// import { firebase, Firestore, Query, QueryConstraint } from 'firestore-local';

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
        const { argsNodeName, argsApiVerb, argsNodeType, resourceId } = this.apiRequest!; // prettier-ignore

        let ref;

        switch (argsNodeType) {
            case 'SINGLE_NODE':
                this.queryConfig.constrains.push(
                    firebase.where('id', '==', argsNodeName)
                );
                ref = firebase.collection(this.db!, 'singles');
                return firebase.query.apply(this, [
                    ref,
                    ...this.queryConfig.constrains,
                ]);

            case 'GROUPED_LIST_NODE':
                if (argsApiVerb === 'getItems') {
                    ref = firebase.collection(
                        this.db!,
                        argsNodeName,
                        resourceId,
                        'items'
                    );
                } else {
                    ref = firebase.collection(this.db!, argsNodeName);
                }

                return firebase.query.apply(this, [
                    ref,
                    ...this.queryConfig.constrains,
                ]);

            case 'COLLECTION_NODE':
            default:
                ref = firebase.collection(this.db!, argsNodeName);
                return firebase.query.apply(this, [
                    ref,
                    ...this.queryConfig.constrains,
                ]);
        }
    }
}
