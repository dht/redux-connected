import { RequestBuilder } from '../_utils/RequestBuilder';
import {
    EndpointConfig,
    ApiRequest,
    ConnectionType,
    EndpointsConfig,
    ActionWithPromise,
} from 'redux-connected-types';
import { put, takeEvery, select } from 'redux-saga/effects';
import { ApiInfo, ApiInfoPerType, NodeType } from 'redux-store-generator';
import { logm } from '../logger/logger';
import * as selectors from '../../selectors/selectors';
import { clearActionP } from '../_utils/dispatchP';
import { addNewRequest } from '../requests/requests';

function* save(action: ActionWithPromise) {
    try {
        const actionTypesRaw = (yield select(
            selectors.$actionTypes
        )) as ApiInfoPerType;

        const apiInfo: ApiInfo = actionTypesRaw[action.type];

        if (action.silent) {
            if (typeof action.resolve === 'function') {
                action.resolve(clearActionP(action));
            }
            return;
        }

        const configs = (yield select(
            selectors.$endpointsConfig
        )) as EndpointsConfig;
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

        // emitTimelineEvent('save', { action });

        const request: ApiRequest = new RequestBuilder()
            .withMethod(verb)
            .withNodeName(nodeName)
            .withNodeType(nodeType)
            .withOriginalAction(action)
            .build();

        yield addNewRequest(request);
    } catch (e) {
        console.log('e ->', e);
    }
}

function* root() {
    try {
        yield put(logm('save saga on'));

        const actionTypesRaw = (yield select(
            selectors.$actionTypes
        )) as ApiInfoPerType;

        const actionTypes = Object.keys(actionTypesRaw).filter((key) => {
            const apiInfo: ApiInfo = actionTypesRaw[key];
            return !apiInfo.isGet && !apiInfo.isLocal;
        });

        yield takeEvery(actionTypes, save);
    } catch (e) {
        console.log('e ->', e);
    }
}

export default root;
