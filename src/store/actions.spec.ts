import { RequestBuilder } from '../utils/RequestBuilder';
import { ConnectionStatus } from '../types';
import {
    config_patchAction,
    config_setAction,
    config_all,
    apiActions,
    requests,
} from './actions';
import { EndpointConfig, RequestPriority } from '../types';
import { Chance } from 'chance';

describe('actions', () => {
    const chance = new Chance();
    let action;

    it('config setAction', () => {
        const actionCreator = config_setAction<EndpointConfig>(
            'API_ENDPOINTS_CONFIG'
        );
        action = actionCreator({
            priority: RequestPriority.HIGH,
            nodeName: 'appState',
        });
        expect(action).toEqual({
            payload: { appState: { priority: 1 } },
            type: 'SET_API_ENDPOINTS_CONFIG',
        });
    });

    it('config patchAction', () => {
        const actionCreator = config_patchAction<EndpointConfig>(
            'API_ENDPOINTS_CONFIG'
        );
        action = actionCreator({
            priority: RequestPriority.HIGH,
            nodeName: 'appState',
        });
        expect(action).toEqual({
            payload: { appState: { priority: 1 } },
            type: 'PATCH_API_ENDPOINTS_CONFIG',
        });
    });

    it('config all', () => {
        const bag = config_all<EndpointConfig>('API_ENDPOINTS_CONFIG');
        expect(Object.keys(bag)).toEqual(['set', 'patch']);
    });

    it('requests actions', () => {
        const requestBuilder = new RequestBuilder();
        const actions = requests;
        const id = chance.word();

        const request = requestBuilder.build();

        action = actions.patch(id, request);
        expect(action).toEqual({
            type: 'PATCH_REQUEST',
            id,
            payload: {
                request,
            },
        });

        action = actions.purge();
        expect(action).toEqual({
            type: 'PURGE_COMPLETED',
        });

        action = actions.push(request);
        expect(action).toEqual({
            type: 'PUSH_REQUEST',
            payload: request,
        });

        action = actions.remove(id);
        expect(action).toEqual({
            type: 'REMOVE_REQUEST',
            id,
        });
    });

    it('generateAction', () => {
        expect(
            apiActions.api.global.settings.patch({
                verifyInternetConnection: true,
            })
        ).toEqual({
            payload: { verifyInternetConnection: true },
            type: 'PATCH_API_GLOBAL_SETTINGS',
            '@@redux-connected/GLOBAL_SETTINGS_ACTION': true,
        });

        expect(
            apiActions.api.global.stats.patch({
                lastSuccessfulRequestTS: 1,
            })
        ).toEqual({
            payload: { lastSuccessfulRequestTS: 1 },
            type: 'PATCH_API_GLOBAL_STATS',
            '@@redux-connected/GLOBAL_STATS_ACTION': true,
        });

        expect(
            apiActions.api.config.patch({
                priority: RequestPriority.HIGH,
                nodeName: 'appState',
            })
        ).toEqual({
            payload: {
                appState: {
                    priority: RequestPriority.HIGH,
                },
            },
            type: 'PATCH_API_ENDPOINTS_CONFIG',
            '@@redux-connected/CONFIG_ACTION': true,
        });

        expect(
            apiActions.api.config.set({
                priority: RequestPriority.HIGH,
                nodeName: 'appState',
            })
        ).toEqual({
            payload: {
                appState: {
                    priority: RequestPriority.HIGH,
                },
            },
            type: 'SET_API_ENDPOINTS_CONFIG',
            '@@redux-connected/CONFIG_ACTION': true,
        });

        expect(
            apiActions.api.status.set({
                connectionStatus: ConnectionStatus.LOADING,
                nodeName: 'appState',
            })
        ).toEqual({
            payload: {
                appState: {
                    connectionStatus: ConnectionStatus.LOADING,
                },
            },
            type: 'SET_API_STATUS',
            '@@redux-connected/STATUS_ACTION': true,
        });

        expect(
            apiActions.api.status.patch({
                connectionStatus: ConnectionStatus.LOADING,
                nodeName: 'appState',
            })
        ).toEqual({
            payload: {
                appState: {
                    connectionStatus: ConnectionStatus.LOADING,
                },
            },
            type: 'PATCH_API_STATUS',
            '@@redux-connected/STATUS_ACTION': true,
        });
    });
});
