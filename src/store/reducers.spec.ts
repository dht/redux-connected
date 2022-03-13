import {
    apiEndpointsConfig,
    apiStatus,
    apiRequests,
    lastAction,
    generateApiReducersForStore,
} from './reducers';
import { ConnectionStatus, ConnectionType } from '../types';
import { NodeType } from 'redux-store-generator';
// import { Chance } from 'chance';
import { RequestBuilder } from '../utils/RequestBuilder';

// const chance = new Chance();

describe('apiConfig', () => {
    it('should be able to SET_ALL', () => {
        const state = {};
        const action = {
            type: 'SET_ALL_API_ENDPOINTS_CONFIG',
            payload: {
                appState: {
                    nodeType: NodeType.SINGLE_NODE,
                    connectionType: ConnectionType.REST,
                },
            },
        };
        expect(apiEndpointsConfig(state, action)).toEqual({
            appState: {
                nodeType: NodeType.SINGLE_NODE,
                connectionType: ConnectionType.REST,
            },
        });
    });

    it('should be able to SET', () => {
        const state = {
            appState: {
                nodeType: NodeType.SINGLE_NODE,
                connectionType: ConnectionType.REST,
            },
            products: {
                nodeType: NodeType.COLLECTION_NODE,
                connectionType: ConnectionType.NONE,
            },
        };
        const action = {
            type: 'SET_API_ENDPOINTS_CONFIG',
            payload: {
                appState: {
                    nodeType: NodeType.SINGLE_NODE,
                    connectionType: ConnectionType.NONE,
                },
            },
        };
        expect(apiEndpointsConfig(state, action)).toEqual({
            appState: {
                nodeType: NodeType.SINGLE_NODE,
                connectionType: ConnectionType.NONE,
            },
            products: {
                nodeType: NodeType.COLLECTION_NODE,
                connectionType: ConnectionType.NONE,
            },
        });
    });

    it('should not be able to OVERWRITE nodeType', () => {
        const state = {
            appState: {
                nodeType: NodeType.SINGLE_NODE,
                connectionType: ConnectionType.REST,
            },
        };
        const action = {
            type: 'SET_API_ENDPOINTS_CONFIG',
            payload: {
                appState: {
                    connectionType: ConnectionType.NONE,
                },
            },
        };
        expect(apiEndpointsConfig(state, action)).toEqual({
            appState: {
                nodeType: NodeType.SINGLE_NODE,
                connectionType: ConnectionType.NONE,
            },
        });
    });

    it('should be able to PATCH', () => {
        const state = {
            appState: {
                nodeType: NodeType.SINGLE_NODE,
                connectionType: ConnectionType.SOCKETS,
            },
            products: {
                nodeType: NodeType.COLLECTION_NODE,
                connectionType: ConnectionType.NONE,
            },
        };
        const action = {
            type: 'PATCH_API_ENDPOINTS_CONFIG',
            payload: {
                appState: {
                    connectionType: ConnectionType.REST,
                    requestsPerMinute: 3,
                },
            },
        };
        expect(apiEndpointsConfig(state, action)).toEqual({
            appState: {
                nodeType: NodeType.SINGLE_NODE,
                connectionType: ConnectionType.REST,
                requestsPerMinute: 3,
            },
            products: {
                nodeType: NodeType.COLLECTION_NODE,
                connectionType: ConnectionType.NONE,
            },
        });
    });

    it('should NOT be able to PATCH nodeType', () => {
        const state = {
            appState: {
                nodeType: NodeType.SINGLE_NODE,
                connectionType: ConnectionType.REST,
            },
        };
        const action = {
            type: 'PATCH_API_ENDPOINTS_CONFIG',
            payload: {
                appState: {
                    nodeType: NodeType.COLLECTION_NODE,
                    connectionType: ConnectionType.REST,
                },
            },
        };
        expect(apiEndpointsConfig(state, action)).toEqual(state);
    });

    it('should PATCH with no payload', () => {
        const state = {
            appState: {
                nodeType: NodeType.SINGLE_NODE,
                connectionType: ConnectionType.REST,
            },
        };
        const action = {
            type: 'PATCH_API_ENDPOINTS_CONFIG',
        };
        expect(apiEndpointsConfig(state, action)).toEqual(state);
    });

    it('should ignore foreign actions', () => {
        const state = {
            appState: {
                nodeType: NodeType.SINGLE_NODE,
                connectionType: ConnectionType.REST,
            },
        };
        const action = {
            type: 'FOREIGN',
        };
        expect(apiEndpointsConfig(state, action)).toEqual(state);
    });
});

describe('apiStatus', () => {
    it('should be able to SET_ALL', () => {
        const state = {};
        const action = {
            type: 'SET_ALL_API_STATUS',
            payload: {
                appState: {
                    connectionStatus: ConnectionStatus.IDLE,
                },
            },
        };
        expect(apiStatus(state, action)).toEqual({
            appState: {
                connectionStatus: ConnectionStatus.IDLE,
            },
        });
    });

    it('should be able to SET', () => {
        const state = {
            appState: {
                connectionStatus: ConnectionStatus.IDLE,
                lastRequestTS: 0,
            },
            products: {
                connectionStatus: ConnectionStatus.IDLE,
            },
        };
        const action = {
            type: 'SET_API_STATUS',
            payload: {
                appState: {
                    connectionStatus: ConnectionStatus.LOADING,
                },
            },
        };
        expect(apiStatus(state, action)).toEqual({
            appState: {
                connectionStatus: ConnectionStatus.LOADING,
            },
            products: {
                connectionStatus: ConnectionStatus.IDLE,
            },
        });
    });

    it('should be able to PATCH', () => {
        const state = {
            appState: {
                connectionStatus: ConnectionStatus.IDLE,
            },
            products: {
                connectionStatus: ConnectionStatus.IDLE,
            },
        };
        const action = {
            type: 'PATCH_API_STATUS',
            payload: {
                appState: {
                    connectionStatus: ConnectionStatus.RETRYING,
                },
            },
        };
        expect(apiStatus(state, action)).toEqual({
            appState: {
                connectionStatus: ConnectionStatus.RETRYING,
            },
            products: {
                connectionStatus: ConnectionStatus.IDLE,
            },
        });
    });
});

describe('api reducers', () => {
    it('generate api reducers', () => {
        const reducers = generateApiReducersForStore();
        expect(Object.keys(reducers)).toEqual(['_api']);
    });
});

describe('api requests', () => {
    let state: any, action: any, request: any, requestBuilder: any;

    beforeEach(() => {
        state = [];
        requestBuilder = new RequestBuilder();
    });

    it('should PUSH_REQUEST', () => {
        request = requestBuilder.build();

        action = {
            type: 'PUSH_REQUEST',
            payload: request,
        };

        expect(apiRequests(state, action)).toEqual([request]);
    });

    it('should PATCH_REQUEST', () => {
        // note this is mutable due to optimization concerns
        request = requestBuilder.build();
        state = [{ ...request }];
        action = {
            type: 'PATCH_REQUEST',
            payload: {
                id: request.meta.id,
                request: {
                    apiVerb: 'put',
                },
            },
        };

        expect(apiRequests(state, action)).toEqual([
            {
                ...request,
                apiVerb: 'put',
            },
        ]);
    });

    it('should REMOVE_REQUEST', () => {
        request = requestBuilder.build();
        state = [request];
        action = {
            type: 'REMOVE_REQUEST',
            payload: {
                id: request.meta.id,
            },
        };

        expect(apiRequests(state, action)).toEqual([]);
    });

    it('should PURGE_COMPLETED', () => {
        request = requestBuilder.withIsCompleted(true).build();

        state = [request];
        action = {
            type: 'PURGE_COMPLETED',
        };

        expect(apiRequests(state, action)).toEqual([]);
    });

    it('should deal with empty payload', () => {
        request = requestBuilder.build();
        state = [{ ...request }];

        action = {
            type: 'PATCH_REQUEST',
        };

        expect(apiRequests(state, action)).toEqual([request]);
    });
});

describe('last action', () => {
    it('last action', () => {
        const action = { type: 'ANY_TYPE' };
        expect(lastAction(null, action)).toEqual(action);
        expect(lastAction({}, action)).toEqual(action);
    });
});
