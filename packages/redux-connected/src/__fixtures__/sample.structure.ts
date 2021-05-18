import { NodeType } from 'redux-store-generator';
import {
    StoreStructureApi,
    ConnectionType,
    RetryStrategy,
    ConnectionStatus,
    RequestResult,
} from '../types/types';

export const state: StoreStructureApi = {
    apiGlobalSettings: {
        beat: 3000,
        maxConcurrentRequests: 30,
        retryStrategy: RetryStrategy.X3_TIMES,
        delayBetweenRetries: 3000,
        verifyInternetConnection: true,
        verifyAfterXMillisOfFailures: 10 * 1000,
    },
    apiGlobalStats: {
        lastSuccessfulRequestTS: 0,
    },
    sagas: {
        get: { isRunning: false },
        requests: { isRunning: false },
        save: { isRunning: false },
    },
    endpointsConfig: {
        appState: {
            connectionType: ConnectionType.NONE,
            retryStrategy: RetryStrategy.X3_TIMES,
            requestsPerMinute: 0,
            pagination: false,
            nodeType: NodeType.SINGLE_NODE,
        },
        products: {
            connectionType: ConnectionType.REST,
            retryStrategy: RetryStrategy.X3_TIMES,
            requestsPerMinute: 3,
            pagination: false,
            nodeType: NodeType.COLLECTION_NODE,
        },
        logs: {
            connectionType: ConnectionType.REST,
            retryStrategy: RetryStrategy.X3_TIMES,
            requestsPerMinute: 3,
            pagination: false,
            nodeType: NodeType.QUEUE_NODE,
        },
        chats: {
            connectionType: ConnectionType.REST,
            retryStrategy: RetryStrategy.X3_TIMES,
            requestsPerMinute: 3,
            pagination: false,
            nodeType: NodeType.QUEUE_NODE,
        },
    },
    status: {
        appState: {
            connectionStatus: ConnectionStatus.IDLE,
            lastRequest: {
                startTS: 0,
                responseTS: 0,
                completedTS: 0,
                responseSize: 0,
                duration: 0,
                result: RequestResult.NONE,
            },
        },
        products: {
            connectionStatus: ConnectionStatus.IDLE,
            lastRequest: {
                startTS: 0,
                responseTS: 0,
                completedTS: 0,
                responseSize: 0,
                duration: 0,
                result: RequestResult.NONE,
            },
        },
        logs: {
            connectionStatus: ConnectionStatus.IDLE,
            lastRequest: {
                startTS: 0,
                responseTS: 0,
                completedTS: 0,
                responseSize: 0,
                duration: 0,
                result: RequestResult.NONE,
            },
        },
        chats: {
            connectionStatus: ConnectionStatus.IDLE,
            lastRequest: {
                startTS: 0,
                responseTS: 0,
                completedTS: 0,
                responseSize: 0,
                duration: 0,
                result: RequestResult.NONE,
            },
        },
    },
};
