import { AxiosInstance } from 'axios';
import {
    Action,
    ActionCreatorPayload,
    ApiVerb,
    CollectionBag,
    Item,
    Json,
    NodeType,
    SingleBag,
} from 'redux-store-generator';

export enum ConnectionType {
    NONE = 'NONE',
    REST = 'REST',
    SOCKETS = 'SOCKETS',
    REALTIME_DATABASE = 'REALTIME_DATABASE',
    FIRESTORE = 'FIRESTORE',
    FS = 'FS',
    FS_DIRECTORY = 'FS_DIRECTORY',
}

export enum ConnectionStatus {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    RETRYING = 'RETRYING',
    PAUSED = 'PAUSED', // no internet
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

export enum RequestResult {
    NONE = 'NONE',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export enum RequestPriority {
    NORMAL = 0,
    HIGH = 1,
    URGENT = 2,
}

export interface ApiSettings {
    beat: number;
    maxConcurrentRequests: number;
    retryStrategy: RetryStrategy;
    delayBetweenRetries: number;
    verifyInternetConnection: boolean;
    verifyAfterXMillisOfFailures: number;
}

export interface ApiStats {
    internetConnectionAvailable?: boolean;
    lastSuccessfulRequestTS?: number;
}

export interface EndpointConfig {
    connectionType?: ConnectionType;
    retryStrategy?: RetryStrategy;
    requestsPerMinute?: number;
    pagination?: boolean;
    priority?: RequestPriority;
    nodeType?: NodeType;
}

export interface ApiRequestStats {
    startTS?: number;
    responseTS?: number;
    completedTS?: number;
    duration?: number;
    responseSize?: number;
    result?: RequestResult;
}

export interface ApiStatus {
    connectionStatus?: ConnectionStatus;
    lastRequest?: ApiRequestStats;
}

export interface SagaState {
    id?: keyof Sagas;
    description?: string;
    isRunning?: boolean;
    startedTS?: number;
    stoppedTS?: number;
    errorTS?: number;
}

export type EndpointsConfig = Record<string, EndpointConfig>;
export type ApiStatuses = Record<string, ApiStatus>;
export type SagasStates = Record<string, SagaState>;

export type EndpointsConfigOverrides = Record<string, Partial<EndpointConfig>>;

export interface StoreStructureApi {
    apiGlobalSettings: ApiSettings;
    apiGlobalStats: ApiStats;
    endpointsConfig: EndpointsConfig;
    status: ApiStatuses;
    sagas: SagasStates;
}

export type withNodeName = {
    nodeName: string;
};

export type ConfigActionCreator = ActionCreatorPayload<
    EndpointConfig & withNodeName
>;
export type StatusActionCreator = ActionCreatorPayload<
    ApiStatus & withNodeName
>;

export type ConfigActionBag = {
    set: ConfigActionCreator;
    patch: ConfigActionCreator;
};

export type StatusActionBag = {
    set: StatusActionCreator;
    patch: StatusActionCreator;
};

export type SettingsActionBag = SingleBag<ApiSettings>;
export type StatsActionBag = SingleBag<ApiStats>;
export type SagasActionBag = CollectionBag<SagaState>;

export type RequestsActionBag = {
    push: (request: ApiRequest) => Action;
    patch: (id: string, request: Partial<ApiRequest>) => Action;
    remove: (id: string) => Action;
    purge: () => Action;
};

export type ConnectedStoreActions = {
    api: {
        global: {
            settings: SettingsActionBag;
            stats: StatsActionBag;
        };
        config: ConfigActionBag;
        status: StatusActionBag;
        requests: RequestsActionBag;
    };
};

export interface Saga {
    saga: any;
    description: string;
}

export interface Sagas {
    get: Saga;
    logger: Saga;
    requests: Saga;
    save: Saga;
    internet: Saga;
}

export interface StartSagaPayload {
    sagaId: keyof Sagas;
}

export interface StopSagaPayload {
    sagaId: keyof Sagas;
}

export type RunningSagas = Record<keyof Sagas, any>;

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type ApiErrorType =
    | 'timeout'
    | 'authorization'
    | 'server'
    | 'javascript';

export interface StoreOptions {
    endpointsConfig?: EndpointsConfigOverrides;
    defaultConnectionType: ConnectionType;
    adapters: {
        rest?: any;
        sockets?: any;
        realtimeDatabase?: any;
        firestore?: any;
        fs?: any;
    };
    devTools?: {
        socketUrl: string;
        socketStoreId: string;
    };
    clearNodes?: string[];
}

export interface StoreDefinition {
    name: string;
    initialState: Json;
    reducers: any;
    middlewares: any;
    sagas: any;
    options: Partial<StoreOptions>;
}

export type Meta = {
    id: string;
    shortId: string;
    createdTS: number;
    sequence: number;
};

export type Log = Json & {
    meta: Meta;
};

export type Reading = {
    meta: Meta;
    state?: any;
    action: Action;
};

export enum ApiRequestStatus {
    IDLE = 'IDLE',
    ON_QUEUE = 'ON_QUEUE',
    RUNNING = 'RUNNING',
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
}

export type ApiRequest = ApiRequestStats & {
    meta: Meta;
    method: HttpMethod;
    apiVerb: ApiVerb;
    nodeName: string;
    nodeType: NodeType;
    path: string;
    params?: Record<string, any>;
    status: ApiRequestStatus;
    errorType?: ApiErrorType;
    errorStatus?: number;
    isCompleted?: boolean;
    isUserGenerated?: boolean;
    priority?: RequestPriority;
    resolve?: any;
    reject?: any;
    retriesCount?: number;
    originalAction?: Action;
    connectionType?: ConnectionType;
};

export type ApiResponse = {
    meta: Meta;
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

export type ConnectionAdapter = {};

export type QueryParams = {
    _page: number;
    _limit: number;
    _sort?: string;
    q?: string;
    [key: string]: number | string | undefined;
};

export interface Adapter {
    fireRequest: (request: ApiRequest) => Promise<ApiResponse>;
}
