import { initLog, log } from './utils/log';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { initSockets } from './utils/sockets';
import { middlewareMirror } from './middlewares/midMirror';
import p from './data/version';

export let store: any;
export let storeId = '';

export type SocketServer = {
    broadcast: any;
    on: any;
};

export type SocketClient = {
    emit: any;
    on: any;
};

export type SocketConfig = SocketServer | SocketClient;

export type SyncOptions = {
    storeId: string;
    config: SocketConfig;
    debug?: boolean;
};

export const initSyncMiddleware = (options: SyncOptions) => {
    initLog(options.debug);
    initSockets(options);
    storeId = options.storeId;

    return middlewareMirror;
};

export const generateStore = (
    reducers: any,
    initialState: any,
    options: SyncOptions,
    extraMiddlewares: any[] = []
) => {
    if (options.debug) {
        console.log(`redux-synced version ${p.version}`);
    }

    initLog(options.debug);
    initSockets(options);
    storeId = options.storeId;

    if (!Array.isArray(extraMiddlewares)) {
        log(
            `extraMiddleware must be an array, received ${typeof extraMiddlewares}`
        );
        return;
    }

    const rootReducer = combineReducers(reducers);
    const middlewares = [middlewareMirror, ...extraMiddlewares];

    const withMiddlewares = applyMiddleware(...middlewares);

    store = createStore(
        rootReducer,
        initialState,
        composeWithDevTools(withMiddlewares)
    ) as any;

    return store;
};

export function isServerconfig(config: SocketConfig): config is SocketServer {
    return (config as SocketServer).broadcast !== undefined;
}
