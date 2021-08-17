import { state } from './initialState';
import { StoreOptions, FsAdapter } from 'redux-connected';
import {
    apiActions as _apiActions,
    ConnectionType,
    generateStore,
    generateActionsForStore,
    generateConnectedStore,
} from 'redux-connected';
import fs from 'fs-extra';

const fsAdapter = new FsAdapter({
    dbPath: './src/data/data.json',
    fs,
});

const options: Partial<StoreOptions> = {
    devTools: true,
    defaultConnectionType: ConnectionType.FS,
    adapters: {
        fs: fsAdapter,
    },
};

export const connectedStore = generateConnectedStore(state, options);
export const connectionActions = _apiActions;

export const store = generateStore(state, options);
export const actions = generateActionsForStore(state);
