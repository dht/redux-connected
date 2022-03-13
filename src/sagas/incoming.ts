import * as selectors from '../store/selectors';
import {
    ActionWithPromise,
    ApiRequest,
    ConnectionType,
    LifecycleStatus,
} from '../types';
import { addNewRequest } from './requests';
import { ApiInfo, NodeType } from 'redux-store-generator';
import { clearActionP } from '../utils/dispatchP';
import { logm } from './logger';
import { put, select, takeEvery } from './_helpers';
import { RequestBuilder } from '../utils/RequestBuilder';
import * as actions from '../store/quickActions';

function* incoming(action: ActionWithPromise) {
    try {
        yield put(logm('incoming action', action));

        const actionTypesRaw = yield* select(selectors.$actionTypes);

        const apiInfo: ApiInfo = actionTypesRaw[action.type];

        if (action.silent) {
            if (typeof action.resolve === 'function') {
                action.resolve(clearActionP(action));
            }
            return;
        }

        const configs = yield* select(selectors.$endpointsConfig);

        const { nodeName, verb } = apiInfo;
        const config = configs[nodeName];
        const { connectionType } = config;

        // TODO: why is this useful
        // action.type = '';

        const nodeTypes = yield* select(selectors.$nodeTypes);

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
            .withNodeType(nodeType as NodeType)
            .withOriginalAction(action)
            .build();

        yield addNewRequest(request);
        yield put(
            actions.addRequestJourneyPoint(
                request,
                LifecycleStatus.RECEIVED,
                clearActionP(action)
            )
        );
    } catch (e) {
        console.log('e ->', e);
    }
}

function* root() {
    try {
        yield put(logm('incoming saga on'));
        const actionTypesRaw = yield* select(selectors.$actionTypes);
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
