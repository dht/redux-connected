import { createSelector } from 'reselect';
import { ConnectedStore, RequestStatus } from '../types';

export const $i = (i: ConnectedStore) => i;

export const $actionTypesRaw = createSelector($i, (state) => state.actionTypes); // prettier-ignore
export const $apiGlobalSettingsRaw = createSelector($i, (state) => state.apiGlobalSettings); // prettier-ignore
export const $apiGlobalStatsRaw = createSelector($i, (state) => state.apiGlobalStats); // prettier-ignore
export const $endpointsConfigRaw = createSelector($i, (state) => state.endpointsConfig); // prettier-ignore
export const $endpointsStateRaw = createSelector($i, (state) => state.endpointsState); // prettier-ignore
export const $nodeTypesRaw = createSelector($i, (state) => state.nodeTypes); // prettier-ignore
export const $requestsRaw = createSelector($i, (state) => state.requests); // prettier-ignore
export const $lastActionRaw = createSelector($i, (state) => state._lastAction); // prettier-ignore

export const $requests = createSelector($requestsRaw, (requests) => {
    return Object.values(requests).sort((a, b) => {
        if (a.createdTS === b.createdTS) {
            return 0;
        }

        return a.createdTS > b.createdTS ? 1 : -1;
    });
});

export const $requestsNew = createSelector($requests, (requests) => {
    return requests.filter((request) => {
        request.requestStatus === RequestStatus.CREATED;
    });
});

export const $requestsQueued = createSelector($requests, (requests) => {
    return requests.filter((request) => {
        request.requestStatus === RequestStatus.IN_QUEUE;
    });
});

export const connectedSelectors = {
    $actionTypesRaw,
    $apiGlobalSettingsRaw,
    $apiGlobalStatsRaw,
    $endpointsConfigRaw,
    $endpointsStateRaw,
    $nodeTypesRaw,
    $requestsRaw,
    $lastActionRaw,
    $requests,
    $requestsNew,
    $requestsQueued,
};
