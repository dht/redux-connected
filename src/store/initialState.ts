import {
    generateActionTypesDictionaryForStore,
    StoreNode,
    StoreStructure,
    analyzeStructure,
    nodeToType,
    NodeType,
} from 'redux-store-generator';
import {
    ConnectionStatus,
    RetryStrategy,
    IReduxConnectedConfig,
    ConnectedStore,
    ConnectionType,
    RequestStatus,
    LifecycleStatus,
} from '../types';

export const initialState: ConnectedStore = {
    apiGlobalSettings: {
        beat: 300,
        maxConcurrentRequests: 30,
        retryStrategy: RetryStrategy.X3_TIMES,
        delayBetweenRetries: 1000,
    },
    apiGlobalStats: {
        internetConnectionAvailable: true,
    },
    endpointsConfig: {
        notifications: {
            id: 'notifications',
            connectionType: ConnectionType.REST,
            retryStrategy: RetryStrategy.X2_TIMES,
            requestsPerMinute: 20,
            pagination: true,
            nodeType: NodeType.COLLECTION_NODE,
        },
    },
    endpointsState: {
        notifications: {
            id: 'notifications',
            connectionStatus: ConnectionStatus.IDLE,
        },
    },
    actionTypes: {
        GET_APPSTATE: {
            id: 'GET_APPSTATE',
            verb: 'get',
            nodeName: 'appState',
            isGet: true,
        },
    },
    nodeTypes: {
        notifications: NodeType.COLLECTION_NODE,
    },
    requests: {
        '1': {
            id: '1',
            shortId: 'string',
            createdTS: 0,
            sequence: 1,
            originalAction: { type: '' },
            argsMethod: 'GET',
            argsConnectionType: ConnectionType.REST,
            argsApiVerb: 'get',
            argsNodeName: 'notifications',
            argsNodeType: NodeType.COLLECTION_NODE,
            argsPath: '/notifications',
            argsParams: {},
            requestStatus: RequestStatus.CREATED,
            responseErrorType: 'none',
            responseErrorStatus: 200,
            isUserGenerated: true,
            items: [
                {
                    id: '1',
                    timestamp: 0,
                    status: LifecycleStatus.RECEIVED,
                    data: {},
                    delta: 0,
                },
            ],
            apiRetriesCount: 0,
            apiStartTS: 0,
            apiResponseTS: 0,
            apiCompletedTS: 0,
            apiDuration: 0,
            apiResponseSize: 0,
        },
    },
    _lastAction: {
        type: '',
        isRemote: true,
        storeId: '',
    },
};

export const cleanInitialState = (state: ConnectedStore) => {
    const output = { ...state };
    output.requests = {};
    return output;
};

export const generateInitialState = <T extends StoreStructure>(
    storeState: T,
    options: Partial<IReduxConnectedConfig>
) => {
    const { endpointsConfigOverrides = {}, defaultEndpointsConfig } = options;

    const output = {
        ...initialState,
    };

    const keys: Array<keyof T> = Object.keys(storeState);

    output.endpointsState = {};
    output.endpointsConfig = {};

    for (const key of keys) {
        const value: StoreNode = storeState[key];
        const type = nodeToType(value);

        output.endpointsState[key as any] = {
            id: key as string,
            connectionStatus: ConnectionStatus.IDLE,
        };

        const overrides = (endpointsConfigOverrides as any)[key as any];

        output.endpointsConfig[key as any] = {
            id: key,
            nodeType: type,
            connectionType: defaultEndpointsConfig?.connectionType,
            ...overrides,
        };
    }

    output.actionTypes = generateActionTypesDictionaryForStore(storeState);
    output.nodeTypes = analyzeStructure(storeState);

    return output;
};
