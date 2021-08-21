import { ApiVerb, NodeType } from 'redux-store-generator';
import {
    ActionWithPromise,
    ApiRequest,
    ApiRequestStatus,
    ConnectionType,
} from 'redux-connected';
import { generateMeta } from './meta';

let sequence = 1;

export class RequestBuilder {
    private output = {
        status: ApiRequestStatus.IDLE,
        retriesCount: 0,
        isCompleted: false,
    } as ApiRequest;
    private id: string = '';

    constructor() {
        this.output.meta = generateMeta(sequence++);
    }

    withConnectionType(connectionType: ConnectionType) {
        this.output.connectionType = connectionType;
        return this;
    }

    withNodeName(value: string) {
        this.output.nodeName = value;
        return this;
    }

    withMethod(value: ApiVerb) {
        this.output.apiVerb = value;
        return this;
    }

    withNodeType(value: NodeType) {
        this.output.nodeType = value;
        return this;
    }

    withIsCompleted(value: boolean) {
        this.output.isCompleted = value;
        return this;
    }

    withParams(params?: Record<string, any>) {
        this.output.params = params;
        return this;
    }

    withOriginalAction(value: ActionWithPromise) {
        this.output.originalAction = value;
        this.output.resolve = value.resolve;
        this.output.reject = value.reject;
        this.output.params = value.payload;
        this.id = value.payload?.id;
        return this;
    }

    build(): ApiRequest {
        if (!this.output.params) {
            delete this.output.params;
        }

        const isCollection = this.output.nodeType === NodeType.COLLECTION_NODE;

        switch (this.output.apiVerb) {
            case 'get':
                this.output.path = `/${this.output.nodeName}`;
                this.output.method = 'GET';
                break;
            case 'patch':
                this.output.path = `/${this.output.nodeName}`;
                if (isCollection) {
                    this.output.path += `/${this.id}`;
                }
                this.output.method = 'PATCH';
                break;
            case 'push':
                this.output.path = `/${this.output.nodeName}`;
                this.output.method = 'POST';
                break;
            case 'add':
                this.output.path = `/${this.output.nodeName}`;
                this.output.method = 'POST';
                break;
            case 'delete':
                this.output.path = `/${this.output.nodeName}`;
                if (isCollection) {
                    this.output.path += `/${this.id}`;
                }
                this.output.method = 'DELETE';
                break;
        }

        return this.output;
    }
}
