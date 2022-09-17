import { ApiRequest } from '../../types';
import {
    query,
    collection,
    Query,
    where,
    QueryConstraint,
    Firestore,
    doc,
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
        const { argsNodeName, argsApiVerb, argsNodeType, argsParams } =
            this.apiRequest!;
        let ref;

        switch (argsNodeType) {
            case 'SINGLE_NODE':
                this.queryConfig.constrains.push(
                    where('id', '==', argsNodeName)
                );
                ref = collection(this.db!, 'singles');
                return query.apply(this, [ref, ...this.queryConfig.constrains]);

            case 'GROUPED_LIST_NODE':
                if (argsApiVerb === 'getItems') {
                    ref = collection(
                        this.db!,
                        argsNodeName,
                        argsParams?.id,
                        'items'
                    );
                } else {
                    ref = collection(this.db!, argsNodeName);
                }

                return query.apply(this, [ref, ...this.queryConfig.constrains]);

            case 'COLLECTION_NODE':
            default:
                ref = collection(this.db!, argsNodeName);
                return query.apply(this, [ref, ...this.queryConfig.constrains]);
        }
    }
}
