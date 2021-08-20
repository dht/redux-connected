import { storeId } from './../store';
import { isServerconfig, store, SyncOptions } from '../store';
import { Json } from './../types';
import { log } from './log';

const REMOTE_ACTION_TYPE = 'action';
let broadcaster: any;
let emitter: any;

export let isSocketServer: boolean = false;

export const initSockets = (options: SyncOptions) => {
    const { config } = options;

    if (isServerconfig(config)) {
        broadcaster = config.broadcast;
        isSocketServer = true;
    } else {
        emitter = config.emit;
        isSocketServer = false;
    }

    if (typeof config.on === 'function') {
        config.on(REMOTE_ACTION_TYPE, (action: any) => {
            if (!store) {
                log('store is not ready yet');
                return;
            }

            log(`receiving action ${action.type} from ${action.storeId}`);

            const isBoomerang = action.storeId === storeId;
            if (isBoomerang) {
                log(
                    'skipping dispatch, remote action originated on this store'
                );
                return;
            }

            store.dispatch(action);
        });
    }
};

export const emit = (eventName: string, data: Json) => {
    if (!emitter || typeof emitter !== 'function') {
        log(`${storeId}: emitter not ready yet`);
        return;
    }

    emitter(eventName, data);
};

export const broadcast = (eventName: string, data: Json) => {
    if (!broadcaster || typeof broadcaster !== 'function') {
        log(`${storeId}: broadcaster not ready yet`);
        return;
    }

    broadcaster(eventName, data);
};

export const remoteAction = (action: any) => {
    const method = isSocketServer ? broadcast : emit;

    const actionStoreId = action.storeId || storeId;
    log(`sending action ${action.type} (${actionStoreId})`);

    method(REMOTE_ACTION_TYPE, {
        ...action,
        isRemote: true,
        storeId: actionStoreId,
    });
};
