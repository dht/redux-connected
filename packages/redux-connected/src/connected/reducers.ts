import { combineReducers } from 'redux';
import {
    Action,
    NodeType,
    generateSingle,
} from 'redux-store-generator';
import {
    EndpointsConfig,
    ApiRequest,
    ApiStatuses,
    Sagas,
    SagaState,
} from '../types/types';

interface Single {
    nodeType?: NodeType;
}

export const generateConfigReducer = <T extends Single>(configName: string) => {
    const config = (state: T, action: Action) => {
        let newState = {} as any;

        switch (action.type) {
            case `SET_${configName}`:
                newState = {
                    ...action.payload,
                };

                if (state.nodeType) {
                    newState.nodeType = state.nodeType;
                }

                return newState;
            case `PATCH_${configName}`:
                newState = {
                    ...state,
                    ...action.payload,
                };

                if (state.nodeType) {
                    newState.nodeType = state.nodeType;
                }

                return newState;
        }
    };

    const configs = (state: T, action: Action) => {
        let newState = {} as any,
            newAction = {} as any,
            payload = {} as any;

        switch (action.type) {
            case `SET_ALL_${configName}`:
                return action.payload;
            case `SET_${configName}`:
            case `PATCH_${configName}`:
                newState = { ...state };
                payload = action.payload || {};
                Object.keys(payload).forEach((key) => {
                    newAction = { ...action, payload: payload[key] };
                    newState[key] = config(newState[key], newAction);
                });
                return newState;
            default:
                return state || {};
        }
    };

    return configs;
};

const saga = (state: SagaState, action: Action) => {
    switch (action.type) {
        case 'SET_SAGA':
            return action.payload;
        case 'PATCH_SAGA':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

export const sagas = (
    state: Record<keyof Sagas, SagaState>,
    action: Action
) => {
    let newState = {} as any,
        id;

    switch (action.type) {
        case 'SET_ALL_SAGAS':
            return action.payload;
        case 'SET_SAGA':
        case 'PATCH_SAGA':
            newState = { ...state };
            id = action.payload?.id as keyof Sagas;
            if (id) {
                newState[id] = saga(state[id], action);
            }
            return newState;
        default:
            return state || {};
    }
};

const apiRequest = (state: ApiRequest, action: Action) => {
    const { payload } = action;
    const { request } = payload!;

    switch (action.type) {
        case 'PATCH_REQUEST':
            // mutability, an anti-pattern in most cases,
            // allows us to avoid fetching the request after every change
            // this is useful as requests are highly volatile
            Object.keys(request).forEach((key) => {
                (state as any)[key] = request[key];
            });
            return state;
        default:
            return state;
    }
};

export const apiRequests = (state: ApiRequest[], action: Action) => {
    const { payload } = action;
    const { id } = payload || {};

    let newState = [] as any,
        index;

    switch (action.type) {
        case 'PUSH_REQUEST':
            return [...state, action.payload];
        case 'PATCH_REQUEST':
            newState = [...state];
            index = state.findIndex((request) => request.meta.id === id);
            if (index >= 0) {
                newState[index] = apiRequest(newState[index], action);
            }
            return newState;
        case 'REMOVE_REQUEST':
            newState = [...state];
            index = state.findIndex((request) => request.meta.id === id);
            if (index >= 0) {
                newState.splice(index, 1);
            }
            return newState;
        case 'PURGE_COMPLETED':
            return state.filter((request: ApiRequest) => !request.isCompleted);
        default:
            return state || {};
    }
};

// https://github.com/reduxjs/redux/issues/580#issuecomment-133188511

export const lastAction = (_state: any, action: Action) => {
    // tslint:disable:no-unused-variable
    return action;
};

const apiSettings = generateSingle('API_GLOBAL_SETTINGS');
const apiStats = generateSingle('API_GLOBAL_STATS');
export const apiEndpointsConfig = generateConfigReducer<EndpointsConfig>('API_ENDPOINTS_CONFIG'); // prettier-ignore
export const apiStatus = generateConfigReducer<ApiStatuses>('API_STATUS');
const apiActionTypes = generateSingle('API_ACTION_TYPES');
const apiNodeTypes = generateSingle('API_NODE_TYPES');

export const generateApiReducersForStore = () => {
    return {
        _api: combineReducers({
            apiGlobalSettings: apiSettings,
            apiGlobalStats: apiStats,
            endpointsConfig: apiEndpointsConfig,
            status: apiStatus,
            actionTypes: apiActionTypes,
            nodeTypes: apiNodeTypes,
            requests: apiRequests,
        }),
    };
};

export const generateSagasReducersForStore = () => {
    return {
        _sagas: sagas,
    };
};
