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
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
});

const restAdapter = new RestAdapter({
    axios: axiosInstance,
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
