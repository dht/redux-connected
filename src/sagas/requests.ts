import * as actions from '../store/quickActions';
import * as selectors from '../store/selectors';
import globals from '../utils/globals';
import { Action } from 'redux-store-generator';
import { apiActions } from '../store/actions';
import { call, delay, fork, put, select, takeEvery } from './_helpers';
import { intervalChannel } from './channels/interval';
import { logm } from '../sagas/logger';
import { setActionLogRequestId } from '../store/quickActions';
import {
    ApiRequest,
    ConnectionStatus,
    ConnectionType,
    ApiSettings,
    ApiResponse,
    ApiRequestStatus,
    RetryStrategy,
    ActionLifecycle,
    SagaEvents,
} from '../types';

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
        const { meta, nodeName } = request;
        const { id } = meta;

        yield put(actions.setActionLogLifecycle(request.actionLogId!, ActionLifecycle.API_REQUEST)); // prettier-ignore
        yield put(actions.addActionLogJourneyPoint(request.actionLogId!, 'api request')); // prettier-ignore

        runningRequests[id] = request;

        yield put(actions.addRequestJourneyPoint(request, 'fired'));
        yield put(actions.onRequestStart(request));
        yield put(actions.connectionChange(nodeName, ConnectionStatus.LOADING));

        let adapter;

        // emitTimelineEvent('requests', { request });

        switch (request.connectionType) {
            case ConnectionType.REST:
                adapter = globals.adapters?.rest;
                break;
            case ConnectionType.FIRESTORE:
                adapter = globals.adapters?.firestore;
                break;
            case ConnectionType.FS:
                adapter = globals.adapters?.fs;
                break;
        }

        if (!adapter) {
            const errorMessage = `no adapter is defined for ${request.connectionType}`;
            yield put(actions.addRequestJourneyPoint(request, errorMessage));
            yield put(actions.setRequestStatus(request, ApiRequestStatus.ERROR)); // prettier-ignore
            throw new Error(errorMessage);
        }

        if (typeof adapter.fireRequest !== 'function') {
            const errorMessage = `invalid adapter is defined for ${request.connectionType}, no fireRequest method`;
            yield put(actions.addRequestJourneyPoint(request, errorMessage));
            yield put(actions.setRequestStatus(request, ApiRequestStatus.ERROR)); // prettier-ignore
            throw new Error(errorMessage);
        }

        const response: ApiResponse = yield call(adapter.fireRequest, request);

        yield put(actions.onRequestResponse(request, response));
        yield put(actions.onApiStatusUpdate(request));

        delete runningRequests[id];

        // error?
        if (!response.isSuccess) {
            yield put(actions.connectionChange(nodeName, ConnectionStatus.LOADING)); // prettier-ignore
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
    const { nodeName } = request;

    yield put(actions.setRequestStatus(request, ApiRequestStatus.ERROR));
    yield put(actions.connectionChange(nodeName, ConnectionStatus.RETRYING));

    yield delay(delayBetweenRetries);
    yield fork(fireRequest, request);
}

function* onError(request: ApiRequest, response: ApiResponse) {
    const retry = yield* call(shouldRetry, request);
    const { nodeName } = request;
    yield put(actions.setRequestStatus(request, ApiRequestStatus.RETRYING));
    yield put(actions.connectionChange(nodeName, ConnectionStatus.ERROR));
    yield put(actions.addRequestJourneyPoint(request, 'api error'));

    if (retry) {
        yield put(actions.onRequestRetry(request));
        yield call(onRetry, request);
        return;
    }

    const nextAction = actions.apiError(request, response);

    request.resolve({ nextAction, response });
}

function* onSuccess(request: ApiRequest, response: ApiResponse) {}

function* shouldRetry(request: ApiRequest) {
    let output = false;
    const configs = yield* select(selectors.$endpointsConfig);

    const config = configs[request.nodeName];

    const { retryStrategy = globalSettings.retryStrategy } = config;
    const { retriesCount = 0 } = request;

    switch (retryStrategy) {
        case RetryStrategy.INDEFINITELY:
            output = true;
            break;
        case RetryStrategy.NONE:
            output = false;
            break;
        case RetryStrategy.X1_TIMES:
            output = retriesCount + 1 < 1;
            break;
        case RetryStrategy.X2_TIMES:
            output = retriesCount + 1 < 2;
            break;
        case RetryStrategy.X3_TIMES:
            output = retriesCount + 1 < 3;
            break;
        case RetryStrategy.X4_TIMES:
            output = retriesCount + 1 < 4;
            break;
        default:
            output = false;
    }

    return output;
}

function* handleIncomingRequests() {
    try {
        const { maxConcurrentRequests } = globalSettings;
        const requests = yield* select(selectors.$idleRequests);

        for (let request of requests) {
            yield put(actions.setRequestStatus(request, ApiRequestStatus.WAITING)); // prettier-ignore
            yield put(actions.addRequestJourneyPoint(request, 'in queue'));
        }

        const runningRequestsCount = Object.keys(runningRequests).length;
        const availableSlots = maxConcurrentRequests - runningRequestsCount;

        for (let i = 0; i < availableSlots; i++) {
            const request = requests[i];
            if (request) {
                yield fork(fireRequest, requests[i]);
            }
        }
    } catch (err) {
        console.log('parseIncomingRequests saga crashed ->', err);
    }
}

function* moveSuccessfulRequestToDone() {
    const requests = yield* select(selectors.$successfulRequests);

    for (let request of requests) {
        yield put(actions.addRequestJourneyPoint(request, 'to done'));
        yield put(actions.setRequestStatus(request, ApiRequestStatus.DONE)); // prettier-ignore
    }
}

function* listenToRequestQueue(): any {
    yield takeEvery(
        intervalChannel(globalSettings.beat),
        handleIncomingRequests
    );
}

function* cleanCompleted(): any {
    yield takeEvery(intervalChannel(5000), moveSuccessfulRequestToDone);
}

export function* addNewRequest(request: ApiRequest): any {
    yield put(apiActions.api.requests.push(request));
    if (request.actionLogId) {
        yield put(setActionLogRequestId(request.actionLogId, request.meta.id));
    }
}

function* root() {
    globalSettings = yield* select(selectors.$apiGlobalSettings);
    yield put(logm('requests saga on'));
    yield fork(listenToRequestQueue);
    yield fork(cleanCompleted);
}

export default root;
