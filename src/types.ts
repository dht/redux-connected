import { AxiosInstance } from 'axios';
import {
    Action,
    ActionCreatorPayload,
    ApiInfoPerType,
    ApiVerb,
    CollectionBag,
    Item,
    NodeType,
    SingleBag,
} from 'redux-store-generator';
import { StoreBuilder } from './builders/StoreBuilder';

export interface IReduxConnectedConfig {
    defaultEndpointsConfig: EndpointConfig;
    endpointsConfigOverrides?: EndpointsConfigOverrides;
    adapters: {
        rest?: any;
    };
    enableReduxDevtools?: boolean;
}

export interface StoreDefinition {
    name: string;
    initialState: Json;
    reducers: any;
    middlewares: any;
    enhancers: any;
    sagas: any;
    enableDevtoolsExtension: boolean;
}

export type Json = Record<string, any>;

export enum ConnectionType {
    NONE = 'NONE',
    REST = 'REST',
    SOCKETS = 'SOCKETS',
    REALTIME_DATABASE = 'REALTIME_DATABASE',
    FIRESTORE = 'FIRESTORE',
    FS = 'FS',
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
    _api: {
        apiGlobalSettings: ApiSettings;
        apiGlobalStats: ApiStats;
        endpointsConfig: EndpointsConfig;
        status: ApiStatuses;
        actionTypes: ApiInfoPerType;
        nodeTypes: Record<string, string>;
        requests: ApiRequest[];
    };
    _sagas: SagasStates;
    _lastAction: Action & {
        isRemote: boolean;
        storeId: string;
    };
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
    clear: () => Action;
    addJourneyPoint: (id: string, point: JourneyPoint) => Action;
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
    incoming: Saga;
    requests: Saga;
    postAction: Saga;
    logger: Saga;
    refresh: Saga;
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

export interface StoreDefinition {
    name: string;
    initialState: Json;
    reducers: any;
    middlewares: any;
    enhancers: any;
    sagas: any;
    enableDevtoolsExtension: boolean;
}

export enum RequestStatus {
    CREATED = 'CREATED',
    WAITING = 'WAITING',
    FIRING = 'FIRING',
    ERROR = 'ERROR',
    NO_INTERNET = 'NO_INTERNET',
    RETRYING = 'RETRYING',
    SUCCESS = 'SUCCESS',
    DONE = 'DONE',
}

export enum ActionLifecycle {
    RECEIVED = 'RECEIVED',
    FILTERED = 'FILTERED',
    API_REQUEST = 'API_REQUEST',
    POST_ACTION = 'POST_ACTION',
}

export interface ApiRequestStats {
    startTS?: number;
    responseTS?: number;
    completedTS?: number;
    duration?: number;
    responseSize?: number;
    result?: RequestResult;
}

export type ApiRequestConfig = {
    method: HttpMethod;
    apiVerb: ApiVerb;
    nodeName: string;
    nodeType: NodeType;
    path: string;
    params?: Record<string, any>;
    isUserGenerated?: boolean;
    connectionType?: ConnectionType;
    priority?: RequestPriority;
};

export type ApiRequestStatus = {
    errorType?: ApiErrorType;
    errorStatus?: number;
    isCompleted?: boolean;
    retriesCount?: number;
};

export type ApiRequest = {
    id: string;
    shortId: string;
    createdTS: number;
    sequence: number;
    status: RequestStatus;
    originalAction: Action;
    journey: Journey;
    stats?: ApiRequestStats;
    requestConfig?: ApiRequestConfig;
    apiStatus?: ApiRequestStatus;
    resolve?: any;
    reject?: any;
};

export type JourneyPoint = {
    timestamp: number;
    title: string;
    data?: Json;
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

export type ConnectionAdapter = {};

export interface Adapter {
    fireRequest: (request: ApiRequest) => Promise<ApiResponse>;
}

export type StoreDecorator = (storeBuilder: StoreBuilder) => void;

export type MockUser = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    avatar: string;
};

export type MockLog = {
    id: string;
    date: string;
    priority: number;
};

export type MockProduct = {
    id: string;
    dateAdded: string;
    price: string;
    department: string;
    color: string;
    name: string;
    description: string;
    thumbnail: string;
    imageUrl: string;
    shippingDate: string;
};

export type MockChat = {
    id: string;
    title: string;
    items?: MockChatMessage[];
};

export type MockChatMessage = {
    id: string;
    chatId: string;
    timestamp: string;
    content: string;
    isMe: boolean;
};

export type Mocks = {
    user: MockUser;
    userPartial: Partial<MockUser>;
    log: MockLog;
    logPartial: Partial<MockLog>;
    logSet: MockLog;
    logs: MockLog[];
    product: MockProduct;
    productPartial: Partial<MockProduct>;
    productSet: MockProduct;
    products: MockProduct[];
    chat: MockChat;
    chatPartial: Partial<MockChat>;
    chatSet: MockChat;
    chats: MockChat[];
    chatMessage: MockChatMessage;
    chatMessagePartial: Partial<MockChatMessage>;
    chatMessageSet: MockChatMessage;
    chatMessages: MockChatMessage[];
};

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
}

export type FieldValue = {
    field: string;
    value: any;
};
