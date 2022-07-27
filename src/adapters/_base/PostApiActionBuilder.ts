import { Action, generateActionsForStore } from 'redux-store-generator';
import { ApiResponse, ApiRequest } from '../../types';
import globals from '../../utils/globals';

export class PostApiActionBuilder {
    private apiRequest = {} as ApiRequest;
    private apiResponse = {} as ApiResponse;
    private actions = {} as any;

    constructor() {
        this.actions = generateActionsForStore(globals.structure);
    }

    withRequest(apiRequest: ApiRequest) {
        this.apiRequest = apiRequest;
        return this;
    }

    withResponse(apiResponse: ApiResponse) {
        this.apiResponse = apiResponse;
        return this;
    }

    build(): Action {
        let action = {} as Action;
        const { argsNodeType, argsApiVerb, argsNodeName, originalAction } =
            this.apiRequest;
        const { data = {} } = this.apiResponse;
        const { id, payload } = originalAction || {};

        const actionBag = this.actions[argsNodeName];

        switch (argsNodeType + '_' + argsApiVerb) {
            case 'SINGLE_NODE_get':
                action = actionBag['setAll'](data);
                break;
            case 'QUEUE_NODE_get':
                action = actionBag['pushMany'](data);
                break;
            case 'COLLECTION_NODE_get':
            case 'GROUPED_LIST_NODE_get':
                action = actionBag['setMany'](data);
                break;
            case 'COLLECTION_NODE_add':
                action = actionBag['set'](data.id, data);
                break;
            case 'COLLECTION_NODE_delete':
                action = actionBag['delete'](id);
                break;
            case 'SINGLE_NODE_patch':
                action = actionBag['patch'](payload);
                break;
            case 'COLLECTION_NODE_patch':
                action = actionBag['patch'](id, payload);
                break;
            case 'QUEUE_NODE_push':
                action = actionBag['push'](payload);
                break;
            case 'QUEUE_NODE_pop':
            case 'QUEUE_NODE_clear':
            default:
                action = actionBag[argsApiVerb]();
                break;
        }

        return action;
    }
}
