import { ConnectedStore, JourneyPoint, SagaEvents } from '../types';
import { generateActionsForStore } from 'redux-store-generator';
import { initialState } from './initialState';
import { timestamp } from '../utils/date';
import {
    Json,
    ApiRequest,
    ApiResponse,
    ConnectionStatus,
    LifecycleStatus,
} from '../types';
import { uuidv4 } from '../utils/uuid';

export const apiActions = generateActionsForStore<ConnectedStore>(initialState);

export const apiError = (request: ApiRequest, response: ApiResponse) => {
    return {
        type: 'API_ERROR',
        request,
        response,
    };
};

export const connectionChange = (
    nodeName: string,
    connectionStatus: ConnectionStatus
) => {
    return apiActions.endpointsState.patch(nodeName, {
        connectionStatus,
    });
};

export const addRequestJourneyPoint = (
    request: ApiRequest,
    status: LifecycleStatus,
    data?: Json
) => {
    const journeyPoint: JourneyPoint = {
        id: uuidv4(),
        timestamp: timestamp(),
        status,
        data,
    };

    return apiActions.requests.pushItem(request.id, journeyPoint);
};

export const clearCompletedRequests = () => {
    return {
        type: SagaEvents.CLEAR_COMPLETED_REQUESTS,
    };
};

export const clearFailedRequests = () => {
    return {
        type: SagaEvents.CLEAR_FAILED_REQUESTS,
    };
};

export const actions = {
    ...apiActions,
    apiError,
    connectionChange,
    addRequestJourneyPoint,
    clearCompletedRequests,
    clearFailedRequests,
};
