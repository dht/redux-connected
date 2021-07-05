import { createSelector } from 'reselect';
import {
    EndpointConfig,
    SagaState,
    ApiStatus,
} from 'redux-connected';

export const $i = (i: any) => i;
export const $apiRaw = createSelector($i, (state) => state._api);
export const $configsRaw = createSelector(
    $apiRaw,
    (api) => api.endpointsConfig
);
export const $requestsRaw = createSelector($apiRaw, (api) => api.requests);
export const $sagasRaw = createSelector($i, (state) => state._sagas);
export const $statusRaw = createSelector($apiRaw, (api) => api.status);
export const $globalSettingsRaw = createSelector(
    $apiRaw,
    (api) => api.apiGlobalSettings
);
export const $globalStatsRaw = createSelector(
    $apiRaw,
    (api) => api.apiGlobalStats
);

export const $endpointsConfig = createSelector(
    $configsRaw,
    (configs) => configs as Record<string, EndpointConfig>
);
export const $status = createSelector(
    $statusRaw,
    (state) => state as Record<string, ApiStatus>
);

export const $sagas = createSelector($sagasRaw, (sagas) => {
    return Object.values(sagas) as SagaState[];
});

export const $actionTypes = createSelector($apiRaw, (api) => api.actionTypes);
export const $nodeTypes = createSelector($apiRaw, (api) => api.nodeTypes);

export const $settingsAndStats = createSelector(
    $globalSettingsRaw,
    $globalStatsRaw,
    (settings, stats) => ({
        settings,
        stats,
    })
);
