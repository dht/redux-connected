import * as selectors from '../../selectors/selectors';
import { apiActions } from '../../connected/actions';
import { ApiRequest } from '../../types/types';
import { logm } from './../logger/logger';
import { put, select, takeEvery } from 'redux-saga/effects';
import { RequestBuilder } from '../_utils/RequestsBuilder';
import {
    ActionWithPromise,
    EndpointConfig,
    EndpointsConfig,
    ConnectionType,
} from './../../types/types';
import { ApiInfo, ApiInfoPerType, NodeType } from 'redux-store-generator';

export function* get(apiInfo: ApiInfo, action: ActionWithPromise) {
    const configs = (yield select(selectors.$config)) as EndpointsConfig;
    const { nodeName, verb } = apiInfo;

    const config = configs[nodeName] as EndpointConfig;
    const { connectionType } = config;

    const nodeTypes = (yield select(selectors.$nodeTypes)) as Record<
        string,
        NodeType
    >;
    const nodeType = nodeTypes[nodeName];

    if (connectionType === ConnectionType.NONE || !connectionType) {
        yield put(logm(`connection type is ${connectionType}. skipping`));

        if (typeof action.resolve === 'function') {
            action.resolve({ ignored: true });
        }
        return;
    }

    const request: ApiRequest = new RequestBuilder()
        .withConnectionType(connectionType)
        .withMethod(verb)
        .withNodeName(nodeName)
        .withNodeType(nodeType)
        .withOriginalAction(action)
        .build();

    const nextAction = apiActions.api.requests.push(request);

    yield put(nextAction);
}

function* root() {
    yield put(logm('get saga on'));

    const actionTypes = (yield select(
        selectors.$actionTypes
    )) as ApiInfoPerType;

    for (let actionType of Object.keys(actionTypes)) {
        const apiInfo: ApiInfo = actionTypes[actionType];

        if (apiInfo.isGet && !apiInfo.isLocal) {
            yield takeEvery(actionType, get, apiInfo);
        }
    }
}

export default root;
