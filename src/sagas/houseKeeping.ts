import { select, takeEvery } from 'saga-ts';
import {  SagaEvents,  } from '../types'; // prettier-ignore
import { selectors } from '../store/selectors';
import { put } from 'redux-saga/effects';
import { actions } from '../store/actions';

export function* clearCompletedRequests() {
    const doneRequests = yield* select(selectors.$requestsDone);

    for (let request of doneRequests) {
        yield put(actions.requests.delete(request.id));
    }

    const successRequests = yield* select(selectors.$requestsSuccess);

    for (let request of successRequests) {
        yield put(actions.requests.delete(request.id));
    }
}

export function* clearFailedRequests() {
    const failedRequests = yield* select(selectors.$requestsFailed);

    for (let request of failedRequests) {
        yield put(actions.requests.delete(request.id));
    }
}

function* root() {
    yield takeEvery(
        SagaEvents.CLEAR_COMPLETED_REQUESTS,
        clearCompletedRequests
    );

    yield takeEvery(SagaEvents.CLEAR_FAILED_REQUESTS, clearFailedRequests);
}

export default root;
