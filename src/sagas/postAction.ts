import * as actions from '../store/quickActions';
import { logm } from './logger';
import { PostApiActionBuilder } from '../utils/PostApiActionBuilder';
import { put } from 'redux-saga/effects';
import { takeEvery } from './_helpers';
import {
    ConnectionStatus,
    ApiRequestStatus,
    ActionLifecycle,
    RequestResponseAction,
    SagaEvents,
} from '../types';

function* postAction(action: RequestResponseAction) {
    const { request, response } = action;
    const { nodeName } = request;
    yield put(actions.setRequestStatus(request, ApiRequestStatus.SUCCESS));
    yield put(actions.connectionChange(nodeName, ConnectionStatus.IDLE));
    yield put(actions.addRequestJourneyPoint(request, 'api success'));

    const postAction = new PostApiActionBuilder()
        .withRequest(request)
        .withResponse(response)
        .build();

    yield put(actions.setActionLogLifecycle(request.actionLogId!, ActionLifecycle.POST_ACTION)); // prettier-ignore
    yield put(actions.addActionLogJourneyPoint(request.actionLogId!, 'post action', postAction)); // prettier-ignore

    request.resolve({ nextAction: postAction, response });
}

function* root() {
    yield takeEvery(SagaEvents.POST_ACTION, postAction);
    yield put(logm('postAction saga on', {}));
}

export default root;
