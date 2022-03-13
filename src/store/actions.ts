import { ConnectedStore, JourneyPoint } from '../types';
import { generateActionsForStore } from 'redux-store-generator';
import { initialState } from './initialState';
import { timestamp } from '../utils/date';
import {
    Json,
    ApiRequest,
    RequestStatus,
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

export const onRequestStart = (request: ApiRequest) => {
    // MUTABILITY: as the request object is used during context
    // we can change the value to prevent another fetch

    request.apiStartTS = timestamp();
    request.requestStatus = RequestStatus.FIRING;

    return apiActions.requests.patch(request.id, {
        apiStartTS: timestamp(),
        requestStatus: RequestStatus.FIRING,
    });
};

export const onRequestResponse = (
    request: ApiRequest,
    response: ApiResponse
) => {
    const { apiStartTS = 0 } = request;
    const { data = '' } = response;

    const apiResponseTS = timestamp();
    const apiDuration = apiResponseTS - apiStartTS;
    const apiResponseSize = JSON.stringify(data).length;

    const change: Partial<ApiRequest> = {
        apiResponseTS,
        apiResponseSize,
        apiDuration,
    };

    if (response.isSuccess) {
        change.requestStatus = RequestStatus.SUCCESS;
        change.apiCompletedTS = apiResponseTS;
    } else {
        change.requestStatus = RequestStatus.ERROR;
        change.responseErrorType = response.errorType;
        change.responseErrorStatus = response.status;
    }

    return apiActions.requests.patch(request.id, change);
};

export const onRequestRetry = (request: ApiRequest) => {
    const count = (request.apiRetriesCount || 0) + 1;

    return apiActions.requests.patch(request.id, {
        apiRetriesCount: count,
    });
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

export const setRequestStatus = (
    request: ApiRequest,
    status: RequestStatus
) => {
    return apiActions.requests.patch(request.id, {
        requestStatus: status,
    });
};
