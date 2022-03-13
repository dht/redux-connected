import globals from './utils/globals';
import { connectedMiddleware } from './middlewares/midConnected';
import { generateConnectedStore } from './store/store';
import { StoreBuilder } from './builders/StoreBuilder';
import { StoreStructure } from 'redux-store-generator';
import type { IReduxConnectedConfig } from './types';

export const initReduxConnected = <T extends StoreStructure>(
    config: IReduxConnectedConfig,
    storeBuilder: StoreBuilder
) => {
    storeBuilder.withMiddlewares([connectedMiddleware]);
    storeBuilder.withPostBuildHook((store: any) =>
        initConnectedStore<T>(config, store)
    );
};

const initConnectedStore = <T extends StoreStructure>(
    config: IReduxConnectedConfig,
    store: any
) => {
    globals.mainStore = store;
    globals.adapters = config.adapters;
    globals.structure = store.getState();
    globals.connectedStore = generateConnectedStore<T>(
        store.getState(),
        config
    );
};

export const getConnectedStore = () => {
    return globals.connectedStore;
};
