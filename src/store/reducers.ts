import {
    generateConfigReducer,
    generateListReducer,
} from './reducers.generators';
import { EndpointsConfig, ApiRequest, ApiStatuses } from '../types';
import { combineReducers } from 'redux';
import { Action, generateSingle } from 'redux-store-generator';

// https://github.com/reduxjs/redux/issues/580#issuecomment-133188511

export const lastAction = (_state: any, action: Action) => {
    // tslint:disable:no-unused-variable
    return action;
};

const apiSettings = generateSingle('API_GLOBAL_SETTINGS');
const apiStats = generateSingle('API_GLOBAL_STATS');
export const apiEndpointsConfig = generateConfigReducer<EndpointsConfig>('API_ENDPOINTS_CONFIG'); // prettier-ignore
export const apiRequests = generateListReducer<ApiRequest>('REQUEST');
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
