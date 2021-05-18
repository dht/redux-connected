import { state } from './initialState';
import {
    StoreOptions,
    RestAdapter,
    FirestoreAdapter,
    apiActions as _apiActions,
    ConnectionType,
    generateStore,
    generateActionsForStore,
    generateConnectedStore,
} from 'redux-connected';
import { firestoreDb } from '../utils/firestore';

const restAdapter = new RestAdapter({
    baseURL: 'http://10.100.102.26:3001/api/',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' },
    serverConnectionCheckUrl: 'http://localhost:3001/ping',
});

const firestoreAdapter = new FirestoreAdapter({
    db: firestoreDb,
});

console.log(123, firestoreAdapter.fireRequest);

// control the URLs
// control the query params
// ?date_gt=2020-10-10

const options: Partial<StoreOptions> = {
    devTools: true,
    defaultConnectionType: ConnectionType.REST,
    adapters: {
        rest: restAdapter,
        firestore: firestoreAdapter,
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
