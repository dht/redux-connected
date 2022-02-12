import {
    generateConfigReducer,
    generateListReducer,
} from './reducers.generators';
import { ActionLog } from 'redux-connected-types';
import { combineReducers } from 'redux';
import { Action, generateSingle } from 'redux-store-generator';
import {
    EndpointsConfig,
    ApiRequest,
    ApiStatuses,
    Sagas,
    SagaState,
} from 'redux-connected-types';

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

// https://github.com/reduxjs/redux/issues/580#issuecomment-133188511

export const lastAction = (_state: any, action: Action) => {
    // tslint:disable:no-unused-variable
    return action;
};

const apiSettings = generateSingle('API_GLOBAL_SETTINGS');
const apiStats = generateSingle('API_GLOBAL_STATS');
export const apiEndpointsConfig = generateConfigReducer<EndpointsConfig>('API_ENDPOINTS_CONFIG'); // prettier-ignore
const apiRequests = generateListReducer<ApiRequest>('REQUEST');
const actionLogs = generateListReducer<ActionLog>('ACTION_LOG');
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
            actionLogs,
        }),
    };
};

export const generateSagasReducersForStore = () => {
    return {
        _sagas: sagas,
    };
};
