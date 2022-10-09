import { createSelector } from 'reselect';
import {
    ApiRequest,
    ApiRequests,
    ConnectedStore,
    RequestStatus,
} from '../types';

export const $i = (i: { connected: ConnectedStore }) => i.connected;

export const $actionTypesRaw = createSelector($i, (state: ConnectedStore) => state.actionTypes); // prettier-ignore
export const $apiGlobalSettingsRaw = createSelector($i, (state: ConnectedStore) => state.apiGlobalSettings); // prettier-ignore
export const $apiGlobalStatsRaw = createSelector($i, (state: ConnectedStore) => state.apiGlobalStats); // prettier-ignore
export const $endpointsConfigRaw = createSelector($i, (state: ConnectedStore) => state.endpointsConfig); // prettier-ignore
export const $endpointsStateRaw = createSelector($i, (state: ConnectedStore) => state.endpointsState); // prettier-ignore
export const $nodeTypesRaw = createSelector($i, (state: ConnectedStore) => state.nodeTypes); // prettier-ignore
export const $requestsRaw = createSelector($i, (state: ConnectedStore) => state.requests); // prettier-ignore
export const $lastActionRaw = createSelector($i, (state: ConnectedStore) => state._lastAction); // prettier-ignore

export const $requests = createSelector(
    $requestsRaw,
    (requests: ApiRequests) => {
        return Object.values(requests).sort((a, b) => {
            if (a.createdTS === b.createdTS) {
                return 0;
            }

            return a.createdTS > b.createdTS ? 1 : -1;
        });
    }
);

export const $requestsIncoming = createSelector(
    $requests,
    (requests: ApiRequest[]) => {
        return requests.filter((request) => {
            return (
                request.requestStatus === RequestStatus.CREATED ||
                request.requestStatus === RequestStatus.RETRYING
            );
        });
    }
);

export const $requestsQueued = createSelector(
    $requests,
    (requests: ApiRequest[]) => {
        return requests.filter((request) => {
            return request.requestStatus === RequestStatus.IN_QUEUE;
        });
    }
);

export const $requestsSuccess = createSelector(
    $requests,
    (requests: ApiRequest[]) => {
        return requests.filter((request) => {
            return request.requestStatus === RequestStatus.SUCCESS;
        });
    }
);
export const $requestsDone = createSelector(
    $requests,
    (requests: ApiRequest[]) => {
        return requests.filter((request) => {
            return request.requestStatus === RequestStatus.DONE;
        });
    }
);

export const $requestsFailed = createSelector(
    $requests,
    (requests: ApiRequest[]) => {
        return requests.filter((request) => {
            return request.requestStatus === RequestStatus.FAILED;
        });
    }
);

export const selectors = {
    $actionTypesRaw,
    $apiGlobalSettingsRaw,
    $apiGlobalStatsRaw,
    $endpointsConfigRaw,
    $endpointsStateRaw,
    $nodeTypesRaw,
    $requestsRaw,
    $lastActionRaw,
    $requests,
    $requestsIncoming,
    $requestsQueued,
    $requestsSuccess,
    $requestsDone,
    $requestsFailed,
};
