import { ClientConfig } from './types';
import { initClientSockets, setSocketIO } from './utils/sockets.client';
import { initLog } from './utils/log';
import { setSyncedStore, setSyncedStoreName } from './utils/store';
import { middlewareMirror } from './middlewares/midMirror';
import { StoreBuilder } from 'store-builder-redux';

export const initSyncedStoreForClient = (
    config: ClientConfig,
    storeBuilder: StoreBuilder
) => {
    const { socketIOInstance, reduxStoreId, socketServerUrl, debug } = config;

    initLog(debug);
    setSocketIO(socketIOInstance);
    setSyncedStoreName(reduxStoreId);
    initClientSockets(socketServerUrl);

    storeBuilder.withMiddlewares(middlewareMirror);
    storeBuilder.hooks.postBuild = (store: any) => {
        setSyncedStore(store);
    };
};
