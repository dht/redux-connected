import io from 'socket.io-client';
import { initialState } from '@redux-connected-ui-store';
import { apiActions, generateConnectedStore } from '@redux-connected';
import { initSyncedStoreForClient } from '@redux-synced/src/store.client';
import reset from './sagas/reset';

export const connectedStore = generateConnectedStore(
    initialState,
    {
        devtools: true,
    },
    [],
    (storeBuilder) => {
        console.log(
            'redux-connected-devtools-ui | store.ts | generateConnectedStore'
        );

        initSyncedStoreForClient(
            {
                socketIOInstance: io,
                reduxStoreId: 'devtools',
                socketServerUrl: 'http://localhost:3507',
                debug: false,
            },
            storeBuilder as any
        );

        storeBuilder.clearSagas();
        storeBuilder.withSagas(reset);
    }
);
export const connectedActions = apiActions;
