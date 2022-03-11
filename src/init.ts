import globals from './utils/globals';
import { connectedMiddleware } from './middlewares/midConnected';
import { generateConnectedStore } from './store/storeConnected';
import { StoreBuilder } from '@payem/platformer';
import { StoreStructure } from 'redux-store-generator';
import type { IReduxConnectedConfig } from './types';

export const initReduxConnected = <T extends StoreStructure>(
    config: IReduxConnectedConfig,
    storeBuilder: StoreBuilder
) => {
    storeBuilder.withMiddlewares([connectedMiddleware]);
    storeBuilder.withPostBuildHook((store) =>
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
//2
