import globals from './globals';
export { generateStore, generateConnectedStore } from './store';
export { generateActionsForStore, StoreStructure } from 'redux-store-generator';
export { apiActions } from './connected/actions';
export { startSaga, stopSaga } from './sagas/process-manager';
export {
    ActionWithPromise,
    EndpointConfig,
    EndpointsConfigOverrides,
    ApiRequest,
    ApiStatus,
    ConnectionType,
    Log,
    Reading,
    Sagas,
    SagaState,
    StoreOptions,
    QueryParams,
} from './types/types';

export { useStore } from './hooks/useStore';
export { useMonitor } from './hooks/useMonitor';
export { clearMeta } from './sagas/_utils/meta';
export { dispatchP, clearActionP } from './sagas/_utils/dispatchP';
export {
    $apiRaw,
    $requestsRaw,
    $apiGlobalSettings,
    $config,
    $actionTypes,
    $nodeTypes,
} from './selectors/selectors';

export { RestAdapter } from './adapters/client/rest/adapterRest';
export { FirestoreAdapter } from './adapters/client/firestore/adapterFirestore';
export { FsAdapter } from './adapters/server/fs/adapterFs';

export const structure = globals.structure;
