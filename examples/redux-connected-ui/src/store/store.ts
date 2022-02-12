import io from 'socket.io-client';
import { initialState, MyStore } from '@redux-connected-ui-store';
import { apiActions, generateConnectedStore } from '@redux-connected';
import { initSyncedStoreForClient } from '@redux-synced/src/store.client';
import { ConnectionType, StoreOptions } from 'redux-connected-types';
import { generateActionsForStore, generateStore } from '@redux-connected';
import { jsonServerAdapter } from './adapters';

const storeOptions: StoreOptions = {
    defaultConnectionType: ConnectionType.REST,
    adapters: {
        rest: jsonServerAdapter,
    },
    clearNodes: [],
    devtools: true,
};

export const store = generateStore(initialState, storeOptions, []);
export const actions = generateActionsForStore<MyStore>(initialState);

export const connectedStore = generateConnectedStore(
    initialState,
    storeOptions,
    [],
    (storeBuilder) => {
        console.log(
            'redux-connected-store | store.ts | generateConnectedStore'
        );

        initSyncedStoreForClient(
            {
                socketIOInstance: io,
                reduxStoreId: 'client',
                socketServerUrl: 'http://localhost:3507',
                debug: false,
            },
            storeBuilder as any
        );
    }
);
export const connectedActions = apiActions;
