import * as actions from '../store/actions';
import * as selectors from '../store/selectors';
import globals from '../utils/globals';
import { Action } from 'redux-store-generator';
import { call, delay, put, select, takeEvery, fork } from 'saga-ts';
import { intervalChannel } from './channels/interval';
import { ApiRequest, ConnectionStatus, ConnectionType, ApiSettings, ApiResponse, RequestStatus, RetryStrategy, SagaEvents, LifecycleStatus } from '../types'; // prettier-ignore
import { getLiveRequests } from '../utils/liveRequest';
import { timestamp } from '../utils/date';

const runningRequests: Record<string, ApiRequest> = {};

let globalSettings: ApiSettings;

export function addRequest(request: ApiRequest): Action {
    return {
        type: 'REQUEST',
        payload: { request },
    };
}

function* fireRequest(request: ApiRequest): any {
    try {
        const { id, argsNodeName } = request;

        runningRequests[id] = request;

        // on start
        request.apiStartTS = timestamp();
        request.requestStatus = RequestStatus.FIRING;

        yield put(
            actions.connectionChange(argsNodeName, ConnectionStatus.LOADING)
        );

        let adapter;

        switch (request.argsConnectionType) {
            case ConnectionType.REST:
                adapter = globals.adapters?.rest;
                break;
            case ConnectionType.FIRESTORE:
                adapter = globals.adapters?.firestore;
                break;
        }

        if (!adapter) {
            const errorMessage = `no adapter is defined for ${request.argsConnectionType}`;
            yield put(
                actions.addRequestJourneyPoint(
                    request,
                    LifecycleStatus.GENERAL_ERROR
                )
            );
            request.requestStatus = RequestStatus.ERROR;
            throw new Error(errorMessage);
        }

        if (typeof adapter.fireRequest !== 'function') {
            const errorMessage = `invalid adapter is defined for ${request.argsConnectionType}, no fireRequest method`;
            yield put(
                actions.addRequestJourneyPoint(
                    request,
                    LifecycleStatus.GENERAL_ERROR
                )
            );
            request.requestStatus = RequestStatus.ERROR;
            throw new Error(errorMessage);
        }

        yield put(
            actions.addRequestJourneyPoint(
                request,
                LifecycleStatus.PENDING_API_RESPONSE
            )
        );

        const response: ApiResponse = yield call(adapter.fireRequest, request);
        onRequestResponse(request, response);

        delete runningRequests[id];

        // error?
        if (!response.isSuccess) {
            yield put(actions.connectionChange(argsNodeName, ConnectionStatus.LOADING)); // prettier-ignore
            yield call(onError, request, response);
        } else {
            yield put({
                type: SagaEvents.POST_ACTION,
                request,
                response,
            });
        }
    } catch (err) {
        console.log('fireRequest saga crashed ->', err);
    }
}

function* onRetry(request: ApiRequest) {
    const { delayBetweenRetries } = globalSettings;
    const { argsNodeName } = request;

    yield delay(delayBetweenRetries);
    request.requestStatus = RequestStatus.RETRYING;
    yield put(
        actions.connectionChange(argsNodeName, ConnectionStatus.RETRYING)
    );
}

function* onError(request: ApiRequest, response: ApiResponse) {
    const retry = yield* call(shouldRetry, request);
    const { argsNodeName } = request;
    request.requestStatus = RequestStatus.ERROR;
    yield put(actions.connectionChange(argsNodeName, ConnectionStatus.ERROR));
    yield put(
        actions.addRequestJourneyPoint(request, LifecycleStatus.API_ERROR)
    );

    if (retry) {
        request.apiRetriesCount = (request.apiRetriesCount ?? 0) + 1;
        yield call(onRetry, request);
        return;
    }

    request.requestStatus = RequestStatus.FAILED;
    yield put(actions.addRequestJourneyPoint(request, LifecycleStatus.FAILED));

    const nextAction = actions.apiError(request, response);

    request.resolve({ isError: true, nextAction, response });
}

function* shouldRetry(request: ApiRequest) {
    let output = false;

    const configs = yield* select(selectors.$endpointsConfigRaw);
    const config = configs[request.argsNodeName];

    const { retryStrategy = globalSettings.retryStrategy } = config;
    const { apiRetriesCount = 0 } = request;

    switch (retryStrategy) {
        case RetryStrategy.INDEFINITELY:
            output = true;
            break;
        case RetryStrategy.NONE:
            output = false;
            break;
        case RetryStrategy.X1_TIMES:
            output = apiRetriesCount < 1;
            break;
        case RetryStrategy.X2_TIMES:
            output = apiRetriesCount < 2;
            break;
        case RetryStrategy.X3_TIMES:
            output = apiRetriesCount < 3;
            break;
        case RetryStrategy.X4_TIMES:
            output = apiRetriesCount < 4;
            break;
        default:
            output = false;
    }

    return output;
}

function* handleIncomingRequests() {
    try {
        const { maxConcurrentRequests } = globalSettings;

        const newRequests = yield* call(getLiveRequests, selectors.$requestsIncoming); // prettier-ignore

        for (let request of newRequests) {
            request.requestStatus = RequestStatus.IN_QUEUE;
            yield put(
                actions.addRequestJourneyPoint(
                    request,
                    LifecycleStatus.IN_QUEUE
                )
            );
        }

        const queuedRequests = yield* call(getLiveRequests, selectors.$requestsQueued); // prettier-ignore

        const runningRequestsCount = Object.keys(runningRequests).length;
        const availableSlots = maxConcurrentRequests - runningRequestsCount;

        for (let i = 0; i < availableSlots; i++) {
            const request = queuedRequests[i];
            if (request) {
                yield* fork(fireRequest, request);
            }
        }
    } catch (err) {
        console.log('parseIncomingRequests saga crashed ->', err);
    }
}

function* listenToRequestQueue(): any {
    yield takeEvery(
        intervalChannel(globalSettings.beat),
        handleIncomingRequests
    );
}

export const onRequestResponse = (
    request: ApiRequest,
    response: ApiResponse
) => {
    const { apiStartTS = 0 } = request;
    const { data = '' } = response;

    const apiResponseTS = timestamp();
    const apiDuration = apiResponseTS - apiStartTS;
    const apiResponseSize = JSON.stringify(data).length;

    request.apiResponseTS = apiResponseTS;
    request.apiResponseSize = apiResponseSize;
    request.apiDuration = apiDuration;

    if (response.isSuccess) {
        request.requestStatus = RequestStatus.SUCCESS;
        request.apiCompletedTS = apiResponseTS;
    } else {
        request.requestStatus = RequestStatus.ERROR;
        request.responseErrorType = response.errorType;
        request.responseErrorStatus = response.status;
    }
};

function* root() {
    globalSettings = yield* select(selectors.$apiGlobalSettingsRaw);
    yield* fork(listenToRequestQueue);
}

export default root;
