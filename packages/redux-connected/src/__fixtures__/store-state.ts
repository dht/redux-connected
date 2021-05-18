import {
    NodeType,
    StoreNodeTypes,
    StoreStructure,
} from 'redux-store-generator';
import {
    ConnectionStatus,
    ConnectionType,
    RetryStrategy,
    StoreStructureApi,
} from '../types/types';

export const storeStructure: StoreNodeTypes = {
    appState: NodeType.SINGLE_NODE,
    products: NodeType.COLLECTION_NODE,
    logs: NodeType.QUEUE_NODE,
};

export const state: StoreStructureApi = {
    apiGlobalSettings: {
        beat: 3000,
        maxConcurrentRequests: 30,
        retryStrategy: RetryStrategy.X3_TIMES,
        delayBetweenRetries: 1000,
        verifyInternetConnection: true,
        verifyAfterXMillisOfFailures: 10 * 1000,
    },
    apiGlobalStats: {
        internetConnectionAvailable: true,
        lastSuccessfulRequestTS: 0,
    },
    sagas: {
        get: { isRunning: false },
        requests: { isRunning: false },
        save: { isRunning: false },
    },
    endpointsConfig: {
        appState: {
            nodeType: NodeType.SINGLE_NODE,
            connectionType: ConnectionType.REST,
        },
        products: {
            nodeType: NodeType.COLLECTION_NODE,
            connectionType: ConnectionType.REST,
            retryStrategy: RetryStrategy.X3_TIMES,
            requestsPerMinute: 3,
            pagination: true,
        },
        logs: {
            nodeType: NodeType.QUEUE_NODE,
            connectionType: ConnectionType.SOCKETS,
        },
    },
    status: {
        appState: {
            connectionStatus: ConnectionStatus.IDLE,
        },
        products: {
            connectionStatus: ConnectionStatus.IDLE,
        },
        logs: {
            connectionStatus: ConnectionStatus.IDLE,
        },
    },
};

export type AppState = { isLoading: boolean; email?: string };
export type User = { userName?: string; email?: string };
export type Product = {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
    imageUrl: string;
    color: string;
    shippingDate: string;
};
export type Products = Record<string, Product>;
export type Log = { id: string };
export type Logs = Array<Log>;

export interface MyStore extends StoreStructure {
    appState: AppState;
    user: User;
    products: Products;
    logs: Logs;
}

export const myStoreState: MyStore = {
    appState: {
        isLoading: true,
    },
    user: {},
    products: {
        '1': {
            id: '1',
            title: 'first product',
            price: 149.5,
            thumbnail:
                '//www.gravatar.com/avatar/669d08ca748c87f4a2fc168881da1fe4?s=64&d=identicon&r=PG',
            imageUrl:
                '//www.gravatar.com/avatar/25760c726742f26ade0aa87b9fb7c201?s=500&d=identicon&r=PG',
            color: 'gold',
            shippingDate: '2021-10-10',
        },
    },
    logs: [
        {
            id: '1',
        },
    ],
    chats: {
        '1': {
            id: '1',
            items: [],
        },
    },
};

export const partialStore = {
    _api: {
        actionTypes: {
            PATCH_APPSTATE: { verb: 'patch', nodeName: 'appState' },
            PATCH_PRODUCT: {
                verb: 'patch',
                nodeName: 'products',
            },
            SET_LOG: {
                verb: 'set',
                nodeName: 'logs',
                isLocal: true,
            },
        },
        endpointsConfig: {
            appState: {
                nodeType: 'SINGLE_NODE',
                connectionType: 'NONE',
            },
            products: {
                nodeType: 'COLLECTION_NODE',
                connectionType: 'REST',
            },
            logs: {
                nodeType: 'QUEUE_NODE',
                connectionType: 'REST',
            },
            chats: {
                nodeType: 'GROUPED_LIST_NODE',
                connectionType: 'REST',
            },
        },
    },
};

export default state;
