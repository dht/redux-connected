import { apiActions, generateConnectedStore } from '@redux-connected';
import { initialState } from '@redux-connected-ui-store/initialState';
import { initSyncedStoreForServer } from '@redux-synced/src/store.server';
import { CorsDomainsAndPorts } from '@redux-synced/src/types';
const socketIOInstance = require('socket.io');

export const actions = apiActions;
``;
export const initStore = (expressServerInstance: any) => {
    return generateConnectedStore(initialState, {}, [], (storeBuilder) => {
        initSyncedStoreForServer(
            {
                socketIOInstance,
                expressServerInstance,
                corsDomainsAndPorts,
                debug: false,
            },
            storeBuilder as any
        );

        storeBuilder.clearSagas();
    });
};

const corsDomainsAndPorts: CorsDomainsAndPorts = {
    domains: [
        'http://10.100.102.9',
        'http://localhost',
        'http://10.100.102.29',
        'http://localhost',
        'http://127.0.0.1',
        'http://blkr',
    ],
    ports: [3507, 3508, 3509, 3510],
};
