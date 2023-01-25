import { ApiVerb, NodeType } from 'redux-store-generator';
import {
    ActionWithPromise,
    ApiRequest,
    RequestStatus,
    ConnectionType,
} from '../types';
import { generateIds } from '../utils/ids';

let sequence = 1;

export class RequestBuilder {
    private output: Partial<ApiRequest> = {
        requestStatus: RequestStatus.CREATED,
        items: [],
        optimistic: false,
        optimisticPosts: false,
        optimisticCurrent: false,
        isSilent: false,
        isLocalSet: false,
    };

    constructor() {
        this.output = {
            ...generateIds(sequence++),
            ...this.output,
        };
    }

    withConnectionType(connectionType: ConnectionType) {
        this.output.argsConnectionType = connectionType;
        return this;
    }

    withAdapterId(adapterId?: string) {
        this.output.adapterId = adapterId;
        return this;
    }

    withNodeName(value: string) {
        this.output.argsNodeName = value;
        return this;
    }

    withMethod(value: ApiVerb) {
        this.output.argsApiVerb = value;
        return this;
    }

    withNodeType(value: NodeType) {
        this.output.argsNodeType = value;
        return this;
    }

    withParams(params?: Record<string, any>) {
        this.output.argsParams = params;
        return this;
    }

    withOptimistic(optimistic?: boolean) {
        this.output.optimistic = optimistic;
        return this;
    }

    withOptimisticPosts(optimisticPosts?: boolean) {
        this.output.optimisticPosts = optimisticPosts;
        return this;
    }

    withOriginalAction(value: ActionWithPromise) {
        this.output.originalAction = value;
        this.output.resolve = value.resolve;
        this.output.reject = value.reject;
        this.output.resourceId = value.id;
        this.output.resourceItemId = value.itemId;
        this.output.isSilent = value.silent;
        this.output.argsParams = value.payload;
        this.output.echo = value.echo;
        return this;
    }

    isLocalSet() {
        const { originalAction } = this.output;
        const { type = '' } = originalAction || {};

        return type.includes('SET_MANY');
    }

    build(): ApiRequest {
        if (!this.output.argsParams) {
            delete this.output.argsParams;
        }

        const isCollection =
            this.output.argsNodeType === NodeType.COLLECTION_NODE ||
            this.output.argsNodeType === NodeType.GROUPED_LIST_NODE;

        const { argsNodeName, resourceId, resourceItemId, argsApiVerb } =
            this.output;

        this.output.isLocalSet = this.isLocalSet();

        switch (argsApiVerb) {
            case 'get':
                this.output.argsPath = `/${argsNodeName}`;
                this.output.argsMethod = 'GET';
                break;
            case 'patch':
                this.output.argsPath = `/${argsNodeName}`;

                if (isCollection) {
                    this.output.argsPath += `/${resourceId}`;
                }

                this.output.argsMethod = 'PATCH';
                break;
            case 'push':
                this.output.argsPath = `/${argsNodeName}`;
                this.output.argsMethod = 'POST';
                break;
            case 'add':
                this.output.argsPath = `/${argsNodeName}`;
                this.output.argsMethod = 'POST';
                break;
            case 'delete':
                this.output.argsPath = `/${argsNodeName}`;
                if (isCollection) {
                    this.output.argsPath += `/${resourceId}`;
                }
                this.output.argsMethod = 'DELETE';
                break;
            case 'pushItem':
                this.output.argsPath = `/${argsNodeName}/${resourceId}`;
                this.output.argsMethod = 'POST';
                break;
            case 'deleteItem':
                this.output.argsPath = `/${argsNodeName}/${resourceId}/items/${resourceItemId}`;
                this.output.argsMethod = 'DELETE';
                break;
            case 'patchItem':
                this.output.argsPath = `/${argsNodeName}/${resourceId}/items/${resourceItemId}`;
                this.output.argsMethod = 'PATCH';
                break;
            case 'getItems':
                this.output.argsPath = `/${argsNodeName}/${resourceId}/items`;
                this.output.argsMethod = 'GET';
                break;
        }

        return this.output as ApiRequest;
    }
}
