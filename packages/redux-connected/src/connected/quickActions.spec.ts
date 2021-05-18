import {
    ApiErrorType,
    ConnectionStatus,
    RequestResult,
} from './../types/types';
import { RequestBuilder } from './../sagas/_utils/RequestsBuilder';
import { ResponseBuilder } from './../sagas/_utils/ResponseBuilder';
import {
    apiError,
    onRequestStart,
    onRequestResponse,
    onRequestRetry,
    onApiStatusUpdate,
    connectionChange,
    onApiSettingsChange,
    onApiStatsChange,
    onGlobalStatsLastSuccessfulRequest,
} from './quickActions';

import { Chance } from 'chance';

jest.mock('../sagas/_utils/date');

const chance = new Chance();

describe('quickActions', () => {
    let requestBuilder: RequestBuilder, responseBuilder: ResponseBuilder;

    beforeEach(() => {
        requestBuilder = new RequestBuilder();
        responseBuilder = new ResponseBuilder(requestBuilder.build());
    });

    it('apiError', () => {
        const request = requestBuilder.build();
        const response = responseBuilder.build();

        expect(apiError(request, response)).toEqual({
            type: 'API_ERROR',
            request,
            response,
        });
    });

    it('onRequestStart', () => {
        const request = requestBuilder.build();

        expect(onRequestStart(request)).toEqual({
            type: 'PATCH_REQUEST',
            payload: {
                id: request.meta.id,
                request: {
                    startTS: 100,
                    status: 'RUNNING',
                },
            },
        });
    });

    it('onRequestResponse with success', () => {
        const request = requestBuilder.build();
        responseBuilder = new ResponseBuilder(request);
        const response = responseBuilder.withIsSuccess(true).build();

        expect(onRequestResponse(request, response)).toEqual({
            type: 'PATCH_REQUEST',
            payload: {
                id: request.meta.id,
                request: {
                    completedTS: 100,
                    duration: 100,
                    isCompleted: true,
                    responseSize: 2,
                    responseTS: 100,
                    result: 'SUCCESS',
                    status: 'SUCCESS',
                },
            },
        });
    });

    it('onRequestResponse with error', () => {
        const request = requestBuilder.build();

        responseBuilder = new ResponseBuilder(request);

        const errorType: ApiErrorType = chance.pickone([
            'timeout',
            'authorization',
            'server',
            'javascript',
        ]);

        const response = responseBuilder
            .withErrorType(errorType)
            .withIsSuccess(false)
            .build();

        const errorStatus = chance.pickone([403, 404, 500]);
        response.status = errorStatus;

        expect(onRequestResponse(request, response)).toEqual({
            type: 'PATCH_REQUEST',
            payload: {
                id: request.meta.id,
                request: {
                    duration: 100,
                    errorStatus,
                    errorType,
                    responseSize: 2,
                    responseTS: 100,
                    result: 'ERROR',
                    status: 'ERROR',
                },
            },
        });
    });

    it('onRequestRetry', () => {
        const request = requestBuilder.build();

        expect(onRequestRetry(request)).toEqual({
            type: 'PATCH_REQUEST',
            payload: {
                id: request.meta.id,
                request: { retriesCount: 1 },
            },
        });
    });

    it('onApiStatusUpdate', () => {
        const request = requestBuilder.withNodeName('products').build();
        const response = responseBuilder.withIsSuccess(true).build();
        request.completedTS = chance.integer();
        request.duration = chance.integer();
        request.responseSize = chance.integer();
        request.responseTS = chance.integer();
        request.result = chance.pickone([
            RequestResult.SUCCESS,
            RequestResult.ERROR,
        ]);
        request.startTS = chance.integer();

        expect(onApiStatusUpdate(request)).toEqual({
            '@@redux-connected/STATUS_ACTION': true,
            payload: {
                products: {
                    lastRequest: {
                        completedTS: request.completedTS,
                        duration: request.duration,
                        responseSize: request.responseSize,
                        responseTS: request.responseTS,
                        result: request.result,
                        startTS: request.startTS,
                    },
                },
            },
            type: 'PATCH_API_STATUS',
        });
    });

    it('connectionChange', () => {
        const nodeName = 'products';
        const connectionStatus = chance.pickone([
            ConnectionStatus.IDLE,
            ConnectionStatus.LOADING,
        ]);
        expect(connectionChange(nodeName, connectionStatus)).toEqual({
            '@@redux-connected/STATUS_ACTION': true,
            payload: {
                products: {
                    connectionStatus,
                },
            },
            type: 'PATCH_API_STATUS',
        });
    });

    it('onApiSettingsChange', () => {
        const settings = {} as any;
        expect(onApiSettingsChange(settings)).toEqual({
            type: 'PATCH_API_GLOBAL_SETTINGS',
            payload: settings,
            '@@redux-connected/GLOBAL_SETTINGS_ACTION': true,
        });
    });

    it('onApiSettingsChange', () => {
        const stats = {} as any;
        expect(onApiStatsChange(stats)).toEqual({
            type: 'PATCH_API_GLOBAL_STATS',
            payload: stats,
            '@@redux-connected/GLOBAL_STATS_ACTION': true,
        });
    });

    it('onApiSettingsChange', () => {
        const settings = {} as any;
        expect(onGlobalStatsLastSuccessfulRequest()).toEqual({
            type: 'PATCH_API_GLOBAL_STATS',
            payload: {
                lastSuccessfulRequestTS: 100,
            },
            '@@redux-connected/GLOBAL_STATS_ACTION': true,
        });
    });
});
