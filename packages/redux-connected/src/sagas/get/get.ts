import { emitTimelineEvent } from './../_utils/sockets';
import * as selectors from '../../selectors/selectors';
import { apiActions } from '../../connected/actions';
import { ApiRequest } from '../../types/types';
import { logm } from '../logger/logger';
import { put, select, takeEvery } from 'redux-saga/effects';
import { RequestBuilder } from '../_utils/RequestsBuilder';
import {
    ActionWithPromise,
    EndpointConfig,
    EndpointsConfig,
    ConnectionType,
} from '../../types/types';
import {
    ApiInfo,
    ApiInfoPerType,
    NodeType,
} from 'redux-store-generator';

export function* get(action: ActionWithPromise) {
    try {
        const actionTypesRaw = (yield select(
            selectors.$actionTypes
        )) as ApiInfoPerType;

        const apiInfo: ApiInfo = actionTypesRaw[action.type];

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

        emitTimelineEvent('get', { action });

        const request: ApiRequest = new RequestBuilder()
            .withConnectionType(connectionType)
            .withMethod(verb)
            .withNodeName(nodeName)
            .withNodeType(nodeType)
            .withOriginalAction(action)
            .build();

        const nextAction = apiActions.api.requests.push(request);

        yield put(nextAction);
    } catch (e) {
        console.log('e ->', e);
    }
}

function* root() {
    try {
        yield put(logm('get saga on'));

        const actionTypesRaw = (yield select(
            selectors.$actionTypes
        )) as ApiInfoPerType;

        const actionTypes = Object.keys(actionTypesRaw).filter((key) => {
            const apiInfo: ApiInfo = actionTypesRaw[key];
            return apiInfo.isGet && !apiInfo.isLocal;
        });

        yield takeEvery(actionTypes, get);
    } catch (e) {
        console.log('e ->', e);
    }
}

export default root;
