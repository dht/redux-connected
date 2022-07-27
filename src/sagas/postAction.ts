import * as actions from '../store/actions';
import { PostApiActionBuilder } from '../adapters/_base/PostApiActionBuilder';
import { put } from 'redux-saga/effects';
import { takeEvery } from './_helpers';
import {
    ConnectionStatus,
    RequestStatus,
    RequestResponseAction,
    SagaEvents,
    LifecycleStatus,
} from '../types';

function* postAction(action: RequestResponseAction) {
    const { request, response } = action;
    const { argsNodeName } = request;
    request.requestStatus = RequestStatus.SUCCESS;
    yield put(actions.connectionChange(argsNodeName, ConnectionStatus.IDLE));

    const postAction = new PostApiActionBuilder()
        .withRequest(request)
        .withResponse(response)
        .build();

    yield put(
        actions.addRequestJourneyPoint(
            request,
            LifecycleStatus.POST_ACTION,
            postAction
        )
    );

    request.resolve({ nextAction: postAction, response });
}

function* root() {
    yield takeEvery(SagaEvents.POST_ACTION, postAction);
}

export default root;
