import {
    apiEndpointsConfig,
    apiStatus,
    sagas,
    apiRequests,
    lastAction,
    generateSagasReducersForStore,
    generateApiReducersForStore,
} from './reducers';
import { ConnectionStatus, ConnectionType } from '../types/types';
import { NodeType } from 'redux-store-generator';
import { Chance } from 'chance';
import { RequestBuilder } from '../sagas/_utils/RequestsBuilder';

const chance = new Chance();

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

describe('saga', () => {
    let action, state;

    it('should SET_ALL_SAGAS', () => {
        const payload = {
            1: {
                title: chance.word(),
            },
        };

        action = {
            type: 'SET_ALL_SAGAS',
            payload,
        };
        expect(sagas({} as any, action)).toEqual(payload);
    });

    it('should SET_SAGA', () => {
        const payload = {
            id: 2,
            title: chance.word(),
        };

        action = {
            type: 'SET_SAGA',
            payload,
        };

        expect(sagas({} as any, action)).toEqual({
            [payload.id]: payload,
        });
    });

    it('should PATCH_SAGA', () => {
        const payload = {
            id: 2,
            title: chance.word(),
        };

        action = {
            type: 'PATCH_SAGA',
            payload,
        };

        expect(
            sagas(
                {
                    1: { id: 1 },
                    2: { id: 2 },
                } as any,
                action
            )
        ).toEqual({
            1: { id: 1 },
            [payload.id]: payload,
        });
    });

    it('should ignore PATCH_SAGA with no payload', () => {
        state = {
            1: { id: 1 },
            2: { id: 2 },
        };

        action = {
            type: 'PATCH_SAGA',
        };

        expect(sagas(state as any, action)).toEqual(state);
    });

    it('should ignore PATCH_SAGA with no id', () => {
        state = {
            1: { id: 1 },
            2: { id: 2 },
        };

        const payload = {
            title: chance.word(),
        };

        action = {
            type: 'PATCH_SAGA',
            payload,
        };

        expect(sagas(state as any, action)).toEqual(state);
    });

    it('should deal with empty state', () => {
        action = {
            type: 'FOREIGN',
        };
        expect(sagas(null as any, action)).toEqual({});
        expect(sagas(undefined as any, action)).toEqual({});
    });

    it('generate saga reducers', () => {
        const reducers = generateSagasReducersForStore();
        expect(Object.keys(reducers)).toEqual(['_sagas']);
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
