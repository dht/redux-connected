import * as actions from '../store/quickActions';
import { logm } from './logger';
import { PostApiActionBuilder } from '../utils/PostApiActionBuilder';
import { put } from 'redux-saga/effects';
import { takeEvery } from './_helpers';
import {
    ConnectionStatus,
    RequestStatus,
    RequestResponseAction,
    SagaEvents,
} from '../types';

function* postAction(action: RequestResponseAction) {
    const { request, response } = action;
    const { nodeName } = request;
    yield put(actions.setRequestStatus(request, RequestStatus.SUCCESS));
    yield put(actions.connectionChange(nodeName, ConnectionStatus.IDLE));
    yield put(actions.addRequestJourneyPoint(request, 'api success'));

    const postAction = new PostApiActionBuilder()
        .withRequest(request)
        .withResponse(response)
        .build();

    request.resolve({ nextAction: postAction, response });
}

function* root() {
    yield takeEvery(SagaEvents.POST_ACTION, postAction);
    yield put(logm('postAction saga on', {}));
}

export default root;
