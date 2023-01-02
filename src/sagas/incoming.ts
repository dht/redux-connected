import { actions } from '../store/actions';
import { selectors } from '../store/selectors';
import { ApiInfo, NodeType } from 'redux-store-generator';
import { clearActionP } from '../utils/dispatchP';
import { put, select, takeEvery } from 'saga-ts';
import { RequestBuilder } from '../builders/RequestBuilder';
import {
    ActionWithPromise,
    ApiRequest,
    ConnectionType,
    LifecycleStatus,
    SagaEvents,
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

        const { connectionType, optimistic, optimisticPosts, adapterId } =
            config;

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
            .withOptimisticPosts(optimisticPosts)
            .withAdapterId(adapterId)
            .build();

        yield put(actions.requests.set(request.id, request));

        yield put(
            actions.addRequestJourneyPoint(
                request,
                LifecycleStatus.RECEIVED,
                clearActionP(action)
            )
        );

        if (isOptimistic(action, request, optimistic, optimisticPosts)) {
            yield put({
                type: SagaEvents.POST_ACTION,
                request,
                response: request.argsParams,
                isOptimistic: true,
            });
        }
    } catch (e) {
        console.log('e ->', e);
    }
}

function isOptimistic(
    action: ActionWithPromise,
    request: ApiRequest,
    optimistic?: boolean,
    optimisticPosts?: boolean
) {
    const isGroupedListAddActionWithItems =
        request.argsApiVerb === 'add' &&
        request.argsNodeType === 'GROUPED_LIST_NODE' &&
        action.payload?.items?.length > 0;

    const isDelete = request.argsMethod === 'DELETE';
    const isPatch = request.argsMethod === 'PATCH';
    const isPost = request.argsMethod === 'POST';

    return (
        (optimistic && (isDelete || isPatch)) ||
        (optimisticPosts && isPost && !isGroupedListAddActionWithItems)
    );
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
