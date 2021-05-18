import { Json } from 'redux-store-generator';
import { collection_all, single_all } from 'redux-store-generator';
import {
    EndpointConfig,
    ApiRequest,
    ApiStatus,
    ConnectedStoreActions,
    RequestsActionBag,
    SagasActionBag,
    withNodeName,
} from '../types/types';

export const SIGNATURE_CONFIG = { '@@redux-connected/CONFIG_ACTION': true }; // prettier-ignore
export const SIGNATURE_STATUS = { '@@redux-connected/STATUS_ACTION': true }; // prettier-ignore
export const SIGNATURE_GLOBAL_STATS = { '@@redux-connected/GLOBAL_STATS_ACTION': true }; // prettier-ignore
export const SIGNATURE_GLOBAL_SETTINGS = { '@@redux-connected/GLOBAL_SETTINGS_ACTION': true }; // prettier-ignore
export const SIGNATURE_SAGA = { '@@redux-connected/SAGA_ACTION': true }; // prettier-ignore

// ============== config ==============
export const config_setAction = <T>(configName: string, extra?: Json) => (
    payload: Partial<T> & withNodeName
) => {
    const { nodeName } = payload;

    delete (payload as any)['nodeName'];

    return {
        type: `SET_${configName.toUpperCase()}`,
        payload: {
            [nodeName]: payload,
        },
        ...extra,
    };
};

export const config_patchAction = <T>(configName: string, extra?: Json) => (
    payload: Partial<T> & withNodeName
) => {
    const { nodeName } = payload;

    delete (payload as any)['nodeName'];

    return {
        type: `PATCH_${configName.toUpperCase()}`,
        payload: {
            [nodeName]: payload,
        },
        ...extra,
    };
};

export const config_all = <T>(configName: string, extra?: Json) => {
    return {
        set: config_setAction<T>(configName, extra),
        patch: config_patchAction<T>(configName, extra),
    };
};

export const requests: RequestsActionBag = {
    push: (request: ApiRequest) => ({ type: 'PUSH_REQUEST', payload: request }),
    patch: (id: string, request: Partial<ApiRequest>) => ({ type: 'PATCH_REQUEST', payload: { id, request } }), // prettier-ignore
    remove: (id: string) => ({ type: 'REMOVE_REQUEST', payload: { id } }),
    purge: () => ({ type: 'PURGE_COMPLETED' }),
};

// ============== from store structure ==============
export const apiActions: ConnectedStoreActions = {
    api: {
        global: {
            settings: single_all(
                'API_GLOBAL_SETTINGS',
                SIGNATURE_GLOBAL_SETTINGS
            ),
            stats: single_all('API_GLOBAL_STATS', SIGNATURE_GLOBAL_STATS),
        },
        config: config_all<EndpointConfig>(
            'API_ENDPOINTS_CONFIG',
            SIGNATURE_CONFIG
        ),
        status: config_all<ApiStatus>('API_STATUS', SIGNATURE_STATUS),
        requests,
    },
};

export const sagaActions: SagasActionBag = collection_all(
    'SAGA',
    SIGNATURE_SAGA
);
