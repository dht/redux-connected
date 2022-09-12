import { actions } from '../store/actions';
import { selectors } from '../store/selectors';
import { ApiInfo, NodeType } from 'redux-store-generator';
import { clearActionP } from '../utils/dispatchP';
import { put, select, takeEvery } from './_helpers';
import { RequestBuilder } from '../builders/RequestBuilder';
import {
    ActionWithPromise,
    ApiRequest,
    ConnectionType,
    LifecycleStatus,
} from '../types';

function* incoming(action: ActionWithPromise) {
    try {
        const actionTypesRaw = yield* select(selectors.$actionTypesRaw);

        const apiInfo: ApiInfo = actionTypesRaw[action.type];

        if (action.silent) {
            if (typeof action.resolve === 'function') {
                action.resolve(clearActionP(action));
            }
            return;
        }

        const configs = yield* select(selectors.$endpointsConfigRaw);

        const { nodeName, verb } = apiInfo;
        const config = configs[nodeName];
        const { connectionType, optimistic } = config;

        const nodeTypes = yield* select(selectors.$nodeTypesRaw);

        const nodeType = nodeTypes[nodeName];

        if (connectionType === ConnectionType.NONE || !connectionType) {
            if (typeof action.resolve === 'function') {
                action.resolve({ ignored: true });
            }
            return;
        }

        const request: ApiRequest = new RequestBuilder()
            .withConnectionType(connectionType)
            .withMethod(verb)
            .withNodeName(nodeName)
            .withNodeType(nodeType as NodeType)
            .withOriginalAction(action)
            .withOptimistic(optimistic)
            .build();

        console.log('request ->', JSON.stringify(request, null, 4));

        yield put(actions.requests.set(request.id, request));

        yield put(
            actions.addRequestJourneyPoint(
                request,
                LifecycleStatus.RECEIVED,
                clearActionP(action)
            )
        );

        if (optimistic && verb === 'patch') {
            request.resolve({
                nextAction: action,
            });
        }
    } catch (e) {
        console.log('e ->', e);
    }
}

function* root() {
    try {
        const actionTypesRaw = yield* select(selectors.$actionTypesRaw);
        const actionTypes = Object.keys(actionTypesRaw).filter((key) => {
            const apiInfo: ApiInfo = actionTypesRaw[key];
            return !apiInfo.isLocal;
        });

        yield takeEvery(actionTypes, incoming);
    } catch (e) {
        console.log('e ->', e);
    }
}

export default root;
