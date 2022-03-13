import {
    generateActionTypesDictionaryForStore,
    StoreNode,
    StoreStructure,
    analyzeStructure,
    nodeToType,
} from 'redux-store-generator';
import {
    ApiSettings,
    ApiStatus,
    ApiStats,
    ConnectionStatus,
    RetryStrategy,
    IReduxConnectedConfig,
} from '../types';

const DEFAULT_API_GLOBAL_SETTINGS: ApiSettings = {
    beat: 300,
    maxConcurrentRequests: 30,
    retryStrategy: RetryStrategy.X3_TIMES,
    delayBetweenRetries: 1000,
    verifyInternetConnection: false,
    verifyAfterXMillisOfFailures: 10 * 1000,
};

const DEFAULT_API_GLOBAL_STATS: ApiStats = {
    internetConnectionAvailable: true,
};

const DEFAULT_STATE: Partial<ApiStatus> = {
    connectionStatus: ConnectionStatus.IDLE,
};

export const generateInitialState = <T extends StoreStructure>(
    storeState: T,
    options: Partial<IReduxConnectedConfig>
) => {
    const { endpointsConfigOverrides = {}, defaultEndpointsConfig } = options;

    const output = {
        apiGlobalSettings: { ...DEFAULT_API_GLOBAL_SETTINGS },
        apiGlobalStats: { ...DEFAULT_API_GLOBAL_STATS },
        endpointsConfig: {} as any,
        status: {} as any,
        actionTypes: {} as any,
        nodeTypes: {} as any,
        requests: [] as any,
    };

    const keys: Array<keyof T> = Object.keys(storeState);

    for (const key of keys) {
        const value: StoreNode = storeState[key];
        const type = nodeToType(value);

        output.status[key] = {
            ...DEFAULT_STATE,
        };

        const overrides = (endpointsConfigOverrides as any)[key as any];

        output.endpointsConfig[key] = {
            nodeType: type,
            connectionType: defaultEndpointsConfig?.connectionType,
            ...overrides,
        };
    }

    output.actionTypes = generateActionTypesDictionaryForStore(storeState);
    output.nodeTypes = analyzeStructure(storeState);

    return output;
};
