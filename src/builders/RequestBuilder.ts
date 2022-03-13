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
    };
    private id: string = '';

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

    withOriginalAction(value: ActionWithPromise) {
        this.output.originalAction = value;
        this.output.resolve = value.resolve;
        this.output.reject = value.reject;
        this.output.argsParams = value.payload;
        this.id = value.payload?.id;
        return this;
    }

    build(): ApiRequest {
        if (!this.output.argsParams) {
            delete this.output.argsParams;
        }

        const isCollection =
            this.output.argsNodeType === NodeType.COLLECTION_NODE;

        const { argsNodeName, argsApiVerb } = this.output;

        switch (argsApiVerb) {
            case 'get':
                this.output.argsPath = `/${argsNodeName}`;
                this.output.argsMethod = 'GET';
                break;
            case 'patch':
                this.output.argsPath = `/${argsNodeName}`;
                if (isCollection) {
                    this.output.argsPath += `/${this.id}`;
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
                    this.output.argsPath += `/${this.id}`;
                }
                this.output.argsMethod = 'DELETE';
                break;
        }

        return this.output as ApiRequest;
    }
}
