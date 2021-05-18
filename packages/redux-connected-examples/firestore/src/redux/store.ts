import { state } from './initialState';
import { StoreOptions } from 'redux-connected';
import {
    apiActions as _apiActions,
    ConnectionType,
    generateStore,
    generateActionsForStore,
    generateConnectedStore,
} from 'redux-connected';

const options: Partial<StoreOptions> = {
    devTools: true,
    apiServer: {
        baseURL: 'http://10.100.102.28:3001/api/',
        timeout: 1000,
        headers: { 'X-Custom-Header': 'foobar' },
        serverConnectionCheckUrl: 'http://localhost:3001/ping',
    },
    endpointsConfig: {
        appState: {
            connectionType: ConnectionType.NONE,
        },
    },
};

export const connectedStore = generateConnectedStore(state, options);
export const connectionActions = _apiActions;

export const store = generateStore(state, options);
export const actions = generateActionsForStore(state);
