import { ApiSettings, ApiStats, RequestResult } from '../types/types';
import { apiActions } from './actions';
import {
    ApiRequest,
    ApiRequestStatus,
    ApiResponse,
    ConnectionStatus,
} from '../types/types';
import { timestamp } from '../sagas/_utils/date';

const patchGlobalSettings = apiActions.api.global.settings.patch;
const patchGlobalStats = apiActions.api.global.stats.patch;
const patchRequest = apiActions.api.requests.patch;
const patchStats = apiActions.api.status.patch;

export const apiError = (request: ApiRequest, response: ApiResponse) => {
    return {
        type: 'API_ERROR',
        request,
        response,
    };
};

export const onRequestStart = (request: ApiRequest) => {
    return patchRequest(request.meta.id, {
        startTS: timestamp(),
        status: ApiRequestStatus.RUNNING,
    });
};

export const onRequestResponse = (
    request: ApiRequest,
    response: ApiResponse
) => {
    const { startTS = 0 } = request;
    const { data = '' } = response;

    const responseTS = timestamp();
    const duration = responseTS - startTS;
    const responseSize = JSON.stringify(data).length;

    const change: Partial<ApiRequest> = {
        responseTS,
        responseSize,
        duration,
    };

    if (response.isSuccess) {
        change.status = ApiRequestStatus.SUCCESS;
        change.result = RequestResult.SUCCESS;
        change.completedTS = responseTS;
        change.isCompleted = true;
    } else {
        change.status = ApiRequestStatus.ERROR;
        change.result = RequestResult.ERROR;
        change.errorType = response.errorType;
        change.errorStatus = response.status;
    }

    return patchRequest(request.meta.id, change);
};

export const onRequestRetry = (request: ApiRequest) => {
    request.retriesCount = (request.retriesCount || 0) + 1;

    return patchRequest(request.meta.id, {
        retriesCount: request.retriesCount,
    });
};

export const onApiStatusUpdate = (request: ApiRequest) => {
    const {
        nodeName,
        startTS,
        responseTS,
        completedTS,
        duration,
        responseSize,
        result,
    } = request;

    return patchStats({
        nodeName,
        lastRequest: {
            startTS,
            responseTS,
            completedTS,
            duration,
            responseSize,
            result,
        },
    });
};

export const connectionChange = (
    nodeName: string,
    connectionStatus: ConnectionStatus
) => {
    return patchStats({
        nodeName,
        connectionStatus,
    });
};

export const onApiSettingsChange = (settings: ApiSettings) => {
    return patchGlobalSettings(settings);
};

export const onApiStatsChange = (settings: ApiStats) => {
    return patchGlobalStats(settings);
};

export const onGlobalStatsLastSuccessfulRequest = () => {
    return onApiStatsChange({ lastSuccessfulRequestTS: timestamp() });
};
