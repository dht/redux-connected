import { ApiInfo, NodeType } from 'redux-store-generator';
import { ActionWithPromise, ApiRequest, ConnectionType } from '../types';
import { RequestBuilder } from '../builders/RequestBuilder';
import { selectors } from '../store/selectors';

export const actionToApiRequest = (action: ActionWithPromise, state: any) => {
    const actionTypesRaw = selectors.$actionTypesRaw(state);
    const configs = selectors.$endpointsConfigRaw(state);
    const nodeTypes = selectors.$nodeTypesRaw(state);

    const apiInfo: ApiInfo = actionTypesRaw[action.type];

    const { nodeName, verb } = apiInfo ?? {};
    const config = configs[nodeName];

    const { connectionType, optimistic, optimisticPosts, adapterId } =
        config ?? {};

    const nodeType = nodeTypes[nodeName];

    const request: ApiRequest = new RequestBuilder()
        .withConnectionType(connectionType ?? ConnectionType.NONE)
        .withMethod(verb)
        .withNodeName(nodeName)
        .withNodeType(nodeType as NodeType)
        .withOriginalAction(action)
        .withOptimistic(optimistic)
        .withOptimisticPosts(optimisticPosts)
        .withAdapterId(adapterId)
        .build();

    const optimisticCurrent = calcIsOptimistic(
        action,
        request,
        optimistic,
        optimisticPosts
    );
    request.optimisticCurrent = optimisticCurrent;

    return request;
};

function calcIsOptimistic(
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
