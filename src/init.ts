import globals from './utils/globals';
import { connectedMiddleware } from './middlewares/midConnected';
import { generateConnectedStore } from './store/store';
import { StoreBuilder } from './builders/StoreBuilder';
import { StoreStructure } from 'redux-store-generator';
import type { IReduxConnectedConfig } from './types';

let DEBUG = false;

export const initReduxConnected = <T extends StoreStructure>(
    config: IReduxConnectedConfig,
    storeBuilder: StoreBuilder
) => {
    const { logger = defaultLogger } = config;

    logger('redux-connected: init');

    storeBuilder.withMiddlewares([connectedMiddleware]);

    storeBuilder.withPostBuildHook((store: any) => {
        logger('redux-connected: postBuildHook');
        return initConnectedStore<T>(config, store);
    });
};

const initConnectedStore = <T extends StoreStructure>(
    config: IReduxConnectedConfig,
    store: any
) => {
    const { logger = defaultLogger } = config;

    logger('redux-connected: initConnectedStore');

    globals.mainStore = store;
    globals.adapters = config.adapters;
    globals.structure = store.getState();
    globals.connectedStore = generateConnectedStore<T>(
        store.getState(),
        config
    );

    logger('redux-connected: store is ready', globals.connectedStore);
};

export const getConnectedStore = () => {
    return globals.connectedStore;
};

const defaultLogger = (message: string, data?: Json) => {
    if (!DEBUG) {
        return;
    }
    console.log(message, data);
};
