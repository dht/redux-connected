import { state } from './initialState';
import {
    StoreOptions,
    apiActions as _apiActions,
    generateStore,
    generateActionsForStore,
    generateConnectedStore,
    ConnectionType,
} from '@redux-connected';
import { restAdapter } from './adapters';

const options: Partial<StoreOptions> = {
    defaultConnectionType: ConnectionType.REST,
    adapters: {
        rest: restAdapter,
    },
    devTools: {
        enable: true,
        socketUrl: '',
    },
    clearNodes: [],
};

export const connectedStore = generateConnectedStore(state, options);
export const connectionActions = _apiActions;

export const store = generateStore(state, options);
export const actions = generateActionsForStore(state);
