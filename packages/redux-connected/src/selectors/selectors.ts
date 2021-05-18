import { ApiRequestStatus } from './../types/types';
import { createSelector } from 'reselect';
import { EndpointsConfig, ApiRequest } from '../types/types';

export const $i = (i: any) => i;

export const $apiRaw = createSelector($i, (state: any) => state._api);
export const $requestsRaw = createSelector($apiRaw, (api: any) => api.requests);

export const $apiGlobalSettings = createSelector(
    $apiRaw,
    (api: any) => api.apiGlobalSettings
);

export const $config = createSelector(
    $apiRaw,
    (api: any) => api.endpointsConfig as EndpointsConfig
);

export const $actionTypes = createSelector(
    $apiRaw,
    (api: any) => api.actionTypes
);

export const $nodeTypes = createSelector($apiRaw, (api: any) => api.nodeTypes);

export const $idleRequests = createSelector(
    $requestsRaw,
    (requests: ApiRequest[]) =>
        requests.filter((request) => request.status === ApiRequestStatus.IDLE)
);
