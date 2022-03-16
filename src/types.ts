import { AxiosInstance } from 'axios';
import {
    Action,
    ApiInfoPerType,
    ApiVerb,
    Item,
    NodeType,
} from 'redux-store-generator';

export interface IReduxConnectedConfig {
    defaultEndpointsConfig: EndpointConfig;
    endpointsConfigOverrides?: EndpointsConfigOverrides;
    adapters: {
        rest?: any;
    };
    enableReduxDevtools?: boolean;
}

export type Json = Record<string, any>;

export enum ConnectionType {
    NONE = 'NONE',
    REST = 'REST',
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
    response: ApiResponse;
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
