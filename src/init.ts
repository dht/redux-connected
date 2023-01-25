import globals from './utils/globals';
import { connectedMiddleware } from './middlewares/midConnected';
import { cacheMiddleware } from './middlewares/midCache';
import { generateConnectedStore } from './store/store';
import { StoreBuilder } from './builders/StoreBuilder';
import { StoreStructure } from 'redux-store-generator';
import type { IReduxConnectedConfig } from './types';
import { RestAdapter } from './adapters/rest/adapterRest';

let DEBUG = false;

export const initReduxConnected = <T extends StoreStructure>(
    config: IReduxConnectedConfig,
    storeBuilder: StoreBuilder
) => {
    const { logger = defaultLogger } = config;

    logger('redux-connected: init');

    storeBuilder.withMiddlewares([connectedMiddleware]);

    if (config.clientCaching?.enabled) {
        storeBuilder.withMiddlewares([cacheMiddleware]);
    }

    storeBuilder.withPostBuildHook((store: any) => {
        logger('redux-connected: postBuildHook');
        return initConnectedStore<T>(config, store);
    });
};

export const registerRestAdapter = (
    adapterId: string,
    adapter: RestAdapter
) => {
    globals.adapters[`REST_${adapterId}`] = adapter;
};

const initConnectedStore = <T extends StoreStructure>(
    config: IReduxConnectedConfig,
    store: any
) => {
    const { logger = defaultLogger } = config;

    logger('redux-connected: initConnectedStore');

    const state = flatten<T>(store.getState());

    globals.mainStore = store;
    globals.adapters = config.adapters;
    globals.structure = state;
    globals.config = config;

    globals.connectedStore = generateConnectedStore<T>(state, config);

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

const flatten = <T>(storeState: any): T => {
    const output: any = {};

    Object.keys(storeState).forEach((appId) => {
        const value = storeState[appId];
        Object.keys(value).forEach((nodeName) => {
            output[nodeName] = value[nodeName];
        });
    });

    return output as T;
};
