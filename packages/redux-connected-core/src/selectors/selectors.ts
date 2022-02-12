import { createSelector } from 'reselect';
import {
    ActionLifecycle,
    ActionLog,
    ApiRequest,
    ApiRequestStatus,
    EndpointsConfig,
    StoreStructureApi,
} from 'redux-connected-types';

export const $i = (i: StoreStructureApi) => i;

export const $apiRaw = createSelector($i, (state) => state._api);
export const $requestsRaw = createSelector($apiRaw, (api) => api.requests);
export const $sagasRaw = createSelector($i, (api) => api._sagas);
export const $lastActionRaw = createSelector($i, (api) => api._lastAction);

export const $apiGlobalSettings = createSelector(
    $apiRaw,
    (api) => api.apiGlobalSettings
);

export const $apiGlobalStats = createSelector(
    $apiRaw,
    (api) => api.apiGlobalStats
);

export const $endpointsConfig = createSelector(
    $apiRaw,
    (api) => api.endpointsConfig as EndpointsConfig
);

export const $status = createSelector($apiRaw, (api) => api.status);

export const $actionTypes = createSelector($apiRaw, (api) => api.actionTypes);

export const $nodeTypes = createSelector($apiRaw, (api) => api.nodeTypes);

export const $requestsByStatus = createSelector($requestsRaw, (requests) => {
    return requests.reduce((output, request: ApiRequest) => {
        output[request.status] = output[request.status] || [];
        output[request.status].push(request);
        return output;
    }, {} as Record<ApiRequestStatus, ApiRequest[]>);
});

export const $sagas = createSelector($sagasRaw, (sagas) =>
    Object.values(sagas)
);

export const $lastAction = createSelector(
    $lastActionRaw,
    (lastAction) => lastAction
);

export const $idleRequests = createSelector(
    $requestsRaw,
    (requests: ApiRequest[]) =>
        requests.filter(
            (request) =>
                request.status === ApiRequestStatus.CREATED ||
                request.status === ApiRequestStatus.WAITING
        )
);

export const $successfulRequests = createSelector(
    $requestsRaw,
    (requests: ApiRequest[]) =>
        requests.filter(
            (request) => request.status === ApiRequestStatus.SUCCESS
        )
);

export const $doneRequests = createSelector(
    $requestsRaw,
    (requests: ApiRequest[]) =>
        requests.filter((request) => request.status === ApiRequestStatus.DONE)
);

export const $requests = createSelector($apiRaw, (api) => api.requests);

export const $actionLogs = createSelector($apiRaw, (api) => api.actionLogs);

export const $actionLogsByLifecycle = createSelector(
    $actionLogs,
    (actionLogs) => {
        return actionLogs.reduce((output, actionLog: ActionLog) => {
            output[actionLog.lifecyclePhase] =
                output[actionLog.lifecyclePhase] || [];
            output[actionLog.lifecyclePhase].push(actionLog);
            return output;
        }, {} as Record<ActionLifecycle, ActionLog[]>);
    }
);

export const $settingsAndStats = createSelector(
    $apiGlobalSettings,
    $apiGlobalStats,
    (settings, stats) => ({
        settings,
        stats,
    })
);

export const connectedSelectors = {
    $apiRaw,
    $requestsRaw,
    $sagasRaw,
    $lastActionRaw,
    $apiGlobalSettings,
    $apiGlobalStats,
    $config: $endpointsConfig,
    $status,
    $actionTypes,
    $nodeTypes,
    $requests,
    $sagas,
    $lastAction,
    $idleRequests,
    $successfulRequests,
    $doneRequests,
    $settingsAndStats,
    $requestsByStatus,
    $actionLogs,
    $actionLogsByLifecycle,
};
