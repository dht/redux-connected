import { AxiosInstance } from 'axios';
import {
    Action,
    ApiInfoPerType,
    ApiVerb,
    Item,
    NodeType,
} from 'redux-store-generator';
import { StoreBuilder } from './builders/StoreBuilder';

export interface IReduxConnectedConfig {
    defaultEndpointsConfig: EndpointConfig;
    endpointsConfigOverrides?: EndpointsConfigOverrides;
    adapters: {
        rest?: any;
        firestore?: any;
        localStorage?: any;
        indexedDb?: any;
    };
    clientCaching?: {
        enabled: boolean;
        flavour: 'indexedDb';
    };
    enableReduxDevtools?: boolean;
    logger?: (message: string, data?: Json) => void;
}

export enum ConnectionType {
    NONE = 'NONE',
    REST = 'REST',
    FIRESTORE = 'FIRESTORE',
    LOCAL_STORAGE = 'LOCAL_STORAGE',
}

export enum ConnectionStatus {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    RETRYING = 'RETRYING',
    PAUSED = 'PAUSED',
    ERROR = 'ERROR',
}

export enum RetryStrategy {
    NONE = 'NONE',
    X1_TIMES = 'X1_TIMES',
    X2_TIMES = 'X2_TIMES',
    X3_TIMES = 'X3_TIMES',
    X4_TIMES = 'X4_TIMES',
    INDEFINITELY = 'INDEFINITELY',
}

export enum ErrorReportingStrategy {
    NONE = 'NONE',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
}

export type ConnectedStore = {
    apiGlobalSettings: ApiSettings;
    apiGlobalStats: ApiStats;
    endpointsConfig: EndpointsConfig;
    endpointsState: EndpointsState;
    actionTypes: ApiInfoPerType;
    nodeTypes: Record<string, NodeType>;
    requests: ApiRequests;
    _lastAction: LastAction;
};

export interface ApiSettings {
    beat: number;
    maxConcurrentRequests: number;
    retryStrategy: RetryStrategy;
    delayBetweenRetries: number;
}

export interface ApiStats {
    internetConnectionAvailable?: boolean;
    lastSuccessfulRequestTS?: number;
}

export interface EndpointConfig {
    id: string;
    connectionType?: ConnectionType;
    retryStrategy?: RetryStrategy;
    requestsPerMinute?: number;
    pagination?: boolean;
    nodeType?: NodeType;
    optimistic?: boolean;
    optimisticPosts?: boolean;
    adapterId?: string;
}

export interface EndpointState {
    id: string;
    connectionStatus?: ConnectionStatus;
}

export type EndpointsConfig = Record<string, EndpointConfig>;
export type EndpointsState = Record<string, EndpointState>;

export type EndpointsConfigOverrides = Record<string, Partial<EndpointConfig>>;

export type LastAction = Action & {
    isRemote: boolean;
    storeId: string;
};

export type withNodeName = {
    nodeName: string;
};

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type ApiErrorType =
    | 'none'
    | 'timeout'
    | 'authorization'
    | 'server'
    | 'javascript';

export enum RequestStatus {
    CREATED = 'CREATED',
    IN_QUEUE = 'IN_QUEUE',
    FIRING = 'FIRING',
    ERROR = 'ERROR',
    RETRYING = 'RETRYING',
    SUCCESS = 'SUCCESS',
    DONE = 'DONE',
    FAILED = 'FAILED',
}

export enum LifecycleStatus {
    RECEIVED = 1,
    POST_ACTION_OPTIMISTIC = 1.5,
    IN_QUEUE = 2,
    GENERAL_ERROR = 3,
    PENDING_API_RESPONSE = 4,
    API_ERROR = 5,
    POST_ACTION = 6,
    FAILED = 7,
}

export type ApiRequest = {
    id: string;
    shortId: string;
    createdTS: number;
    sequence: number;
    resourceId: string;
    resourceItemId: string;
    originalAction?: Action;
    argsMethod: HttpMethod;
    argsConnectionType?: ConnectionType;
    argsApiVerb: ApiVerb;
    argsNodeName: string;
    argsNodeType: NodeType;
    argsPath: string;
    argsParams?: Record<string, any>;
    requestStatus: RequestStatus;
    responseErrorType?: ApiErrorType;
    responseErrorStatus?: number;
    isUserGenerated?: boolean;
    items: Journey;
    apiRetriesCount?: number;
    apiStartTS?: number;
    apiResponseTS?: number;
    apiCompletedTS?: number;
    apiDuration?: number;
    apiResponseSize?: number;
    resolve?: any;
    reject?: any;
    optimistic?: boolean;
    optimisticPosts?: boolean;
    optimisticCurrent?: boolean;
    adapterId?: string;
    isSilent?: boolean;
    isLocalSet?: boolean;
    echo?: boolean;
};

export type ApiRequests = Record<string, ApiRequest>;

export type JourneyPoint = {
    id: string;
    timestamp: number;
    status: LifecycleStatus;
    data?: Json;
    delta?: number;
};

export type Journey = JourneyPoint[];

export type ApiResponse = {
    id: string;
    shortId: string;
    createdTS: number;
    sequence: number;
    request: ApiRequest;
    status: number;
    statusText: string;
    data: Json | Item[];
    isSuccess?: boolean;
    isError?: boolean;
    headers: Json;
    errorType?: ApiErrorType;
    errorMessage?: string;
    stopPropagation?: boolean;
};

export type ActionWithPayload<T> = Action & {
    payload: T;
};

export type ActionWithPromise = Action & {
    resolve: any;
    reject: any;
};

export type ConnectionActionResponse = {
    nextAction: Action;
    request?: ApiRequest;
    response: ApiResponse;
    didSkip?: boolean;
    isError?: boolean;
};

export type ApiServerConfiguration = {
    axios: AxiosInstance;
    internetConnectionCheckUrl?: string;
    serverConnectionCheckUrl?: string;
};

export interface Adapter {
    fireRequest: (request: ApiRequest) => Promise<ApiResponse>;
}

export type Order = 'asc' | 'desc';

export type Relation = '==' | '<=' | '<' | '>' | '>=' | '!=' | '//g';

export type Filter = {
    field: string;
    relation: Relation;
    value: string | number | boolean;
};

export type OrderBy = {
    field: string;
    order?: Order;
};

export type Q = {
    value: any;
    fields?: string[];
};

export type Slice = {
    start?: number;
    end?: number;
};

export type GetParams = Partial<{
    q: Q;
    orderBy: OrderBy | OrderBy[];
    filter: Filter | Filter[];
    slice: Slice;
    limit: number;
    page: number;
    withSubitems: boolean;
}>;

export type RequestResponseAction = Action & {
    request: ApiRequest;
    response: ApiResponse;
    isOptimistic?: boolean;
};

export enum SagaEvents {
    POST_ACTION = 'POST_ACTION',
    CLEAR_COMPLETED_REQUESTS = 'CLEAR_COMPLETED_REQUESTS',
    CLEAR_FAILED_REQUESTS = 'CLEAR_FAILED_REQUESTS',
}

export type FieldValue = {
    field: string;
    value: any;
};

export type StoreDecorator = (storeBuilder: StoreBuilder) => StoreBuilder;

export interface StoreDefinition {
    name: string;
    initialState: Json;
    reducers: any;
    middlewares: any;
    enhancers: any;
    sagas: any;
    sagasContext: any;
    enableDevtoolsExtension: boolean;
    sagaMonitor: any;
}

export type Log = any;

export type Json = Record<string, any>;

export interface ILocalDb {
    dispatch: any;
    run: () => Promise<void>;
    actionTypeToNodeName: (actionType: string) => string;
    structureToStoreDefinitions: (structure: any) => Json;
    structureToActionTypes: (structure: any) => Json;
    dispatchSetMany: (nodeName: string, data: Json) => void;
    get: (key: string, id: string) => Promise<Json>;
    set: (key: string, id: string, change: Json) => Promise<void>;
    getMany: (key: string) => Promise<Json[]>;
    setMany: (key: string, data: Json[]) => Promise<void>;
    delete: (key: string, id: string) => Promise<void>;
    bulkDelete: (key: string, ids: string[]) => Promise<void>;
}
