import { initLog } from './utils/log';
import { initServerSockets, setSocketIO } from './utils/sockets.server';
import { setSyncedStore, setSyncedStoreName } from './utils/store';
import { middlewareMirror } from './middlewares/midMirror';
import { ServerConfig } from './types';
import { StoreBuilder } from 'store-builder-redux';

export const initSyncedStoreForServer = (
    config: ServerConfig,
    storeBuilder: StoreBuilder
) => {
    const {
        socketIOInstance,
        expressServerInstance,
        corsDomainsAndPorts,
        debug,
        syncStateConfig,
    } = config;

    initLog(debug);
    setSocketIO(socketIOInstance);
    setSyncedStoreName('server');
    initServerSockets(expressServerInstance, corsDomainsAndPorts);

    storeBuilder.withMiddlewares(middlewareMirror);

    storeBuilder.hooks.postBuild = (store: any) => {
        setSyncedStore(
            store,
            syncStateConfig?.actions,
            syncStateConfig?.syncNodes
        );
    };
};
