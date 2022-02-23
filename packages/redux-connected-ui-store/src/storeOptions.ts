import { ConnectionType, StoreOptions } from 'redux-connected-types';
import { jsonServerAdapter } from '../../redux-connected-ui/src/store/adapters';

export const storeOptions: Partial<StoreOptions> = {
    defaultConnectionType: ConnectionType.REST,
    adapters: {
        rest: jsonServerAdapter,
    },
    clearNodes: [],
};
