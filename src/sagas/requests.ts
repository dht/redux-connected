import * as actions from '../store/actions';
import * as selectors from '../store/selectors';
import globals from '../utils/globals';
import { Action } from 'redux-store-generator';
import { apiActions } from '../store/actions';
import { call, delay, fork, put, select, takeEvery } from './_helpers';
import { intervalChannel } from './channels/interval';
import { ApiRequest, ConnectionStatus, ConnectionType, ApiSettings, ApiResponse, RequestStatus, RetryStrategy, SagaEvents, LifecycleStatus } from '../types'; // prettier-ignore

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

        yield put(actions.onRequestStart(request));

        yield put(
            actions.connectionChange(argsNodeName, ConnectionStatus.LOADING)
        );

        let adapter;

        switch (request.argsConnectionType) {
            case ConnectionType.REST:
                adapter = globals.adapters?.rest;
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
            yield put(actions.setRequestStatus(request, RequestStatus.ERROR)); // prettier-ignore
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
            yield put(actions.setRequestStatus(request, RequestStatus.ERROR)); // prettier-ignore
            throw new Error(errorMessage);
        }

        yield put(
            actions.addRequestJourneyPoint(
                request,
                LifecycleStatus.PENDING_API_RESPONSE
            )
        );
        const response: ApiResponse = yield call(adapter.fireRequest, request);

        yield put(actions.onRequestResponse(request, response));

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

function* onRetry(requestId: string) {
    const requests = yield* select(selectors.$requestsRaw);
    const request = requests[requestId]
    const { delayBetweenRetries } = globalSettings;
    const { argsNodeName } = request;

    yield put(actions.setRequestStatus(request, RequestStatus.RETRYING));
    yield put(
        actions.connectionChange(argsNodeName, ConnectionStatus.RETRYING)
    );

    yield delay(delayBetweenRetries);
    yield fork(fireRequest, request);
}

function* onError(request: ApiRequest, response: ApiResponse) {
    const retry = yield* call(shouldRetry, request);
    const { argsNodeName } = request;
    yield put(actions.setRequestStatus(request, RequestStatus.ERROR));
    yield put(actions.connectionChange(argsNodeName, ConnectionStatus.ERROR));
    yield put(
        actions.addRequestJourneyPoint(request, LifecycleStatus.API_ERROR)
    );

    if (retry) {
        yield put(actions.onRequestRetry(request));
        yield call(onRetry, request.id);
        return;
    }

    const nextAction = actions.apiError(request, response);

    request.resolve({ nextAction, response });
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
            output = apiRetriesCount + 1 < 1;
            break;
        case RetryStrategy.X2_TIMES:
            output = apiRetriesCount + 1 < 2;
            break;
        case RetryStrategy.X3_TIMES:
            output = apiRetriesCount + 1 < 3;
            break;
        case RetryStrategy.X4_TIMES:
            output = apiRetriesCount + 1 < 4;
            break;
        default:
            output = false;
    }

    return output;
}

function* handleIncomingRequests() {
    try {
        const { maxConcurrentRequests } = globalSettings;
        const newRequests = yield* select(selectors.$requestsIncoming);

        for (let request of newRequests) {
            yield put(actions.setRequestStatus(request, RequestStatus.IN_QUEUE)); // prettier-ignore
            yield put(
                actions.addRequestJourneyPoint(
                    request,
                    LifecycleStatus.IN_QUEUE
                )
            );
        }

        const queuedRequests = yield* select(selectors.$requestsQueued);
        const runningRequestsCount = Object.keys(runningRequests).length;
        const availableSlots = maxConcurrentRequests - runningRequestsCount;

        for (let i = 0; i < availableSlots; i++) {
            const request = queuedRequests[i];
            if (request) {
                yield fork(fireRequest, request);
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

export function* addNewRequest(request: ApiRequest): any {
    yield put(apiActions.requests.set(request.id, request));
}

function* root() {
    globalSettings = yield* select(selectors.$apiGlobalSettingsRaw);
    yield fork(listenToRequestQueue);
}

export default root;
