import globals from './globals';
export { generateActionsForStore } from 'redux-store-generator';
export { generateStore } from './store';
export { generateConnectedStore } from './storeConnected';
export type { StoreStructure } from 'redux-store-generator';
export { apiActions } from './connected/actions';
export { startSaga, stopSaga } from './sagas/process-manager';
export { useStore } from './hooks/useStore';
export { useMonitor } from './hooks/useMonitor';
export { generateMeta, clearMeta } from './sagas/_utils/meta';
export { dispatchP, clearActionP } from './sagas/_utils/dispatchP';
export { connectedSelectors } from './selectors/selectors';
export {
    getMainStoreDefinition,
    getConnectStoreDefinition,
} from './storeDefinitions';

export { RequestBuilder } from './sagas/_utils/RequestBuilder';
export { ResponseBuilder } from './sagas/_utils/ResponseBuilder';

export const structure = globals.structure;
console.log('redux-connected ->', '0.0.187');
