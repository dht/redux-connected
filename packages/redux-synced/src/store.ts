import { initLog } from './utils/log';
import { initSockets } from './utils/sockets';
import { middlewareMirror } from './middlewares/midMirror';

export let reduxStore: any;
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

export const initSyncedStore = (store: any) => {
    reduxStore = store;
};

export function isServerconfig(config: SocketConfig): config is SocketServer {
    return (config as SocketServer).broadcast !== undefined;
}
