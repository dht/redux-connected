import { apiActions } from '../../connected/actions';
import { RequestBuilder } from '../_utils/RequestsBuilder';
import {
    EndpointConfig,
    ApiRequest,
    ConnectionType,
    EndpointsConfig,
    ActionWithPromise,
} from '../../types/types';
import { put, takeEvery, select } from 'redux-saga/effects';
import {
    ApiInfo,
    ApiInfoPerType,
    NodeType,
} from 'redux-store-generator';
import { logm } from '../logger/logger';
import * as selectors from '../../selectors/selectors';
import { clearActionP } from '../_utils/dispatchP';

function* save(apiInfo: ApiInfo, action: ActionWithPromise) {
    if (action.silent) {
        if (typeof action.resolve === 'function') {
            action.resolve(clearActionP(action));
        }
        return;
    }

    const configs = (yield select(selectors.$config)) as EndpointsConfig;
    const { nodeName, verb } = apiInfo;
    const config = configs[nodeName] as EndpointConfig;
    const { connectionType } = config;

    action.type = '';

    const nodeTypes = (yield select(selectors.$nodeTypes)) as Record<
        string,
        NodeType
    >;

    const nodeType = nodeTypes[nodeName];

    if (connectionType === ConnectionType.NONE || !connectionType) {
        yield put(logm(`connection type is ${connectionType}. skipping`));
        return;
    }

    const request: ApiRequest = new RequestBuilder()
        .withMethod(verb)
        .withNodeName(nodeName)
        .withNodeType(nodeType)
        .withOriginalAction(action)
        .build();

    const nextAction = apiActions.api.requests.push(request);
    yield put(nextAction);
}

function* root() {
    yield put(logm('save saga on'));

    const actionTypes = (yield select(
        selectors.$actionTypes
    )) as ApiInfoPerType;

    for (let actionType of Object.keys(actionTypes)) {
        const apiInfo: ApiInfo = actionTypes[actionType];

        if (!apiInfo.isGet && !apiInfo.isLocal) {
            yield takeEvery(actionType, save, apiInfo);
        }
    }
}

export default root;
