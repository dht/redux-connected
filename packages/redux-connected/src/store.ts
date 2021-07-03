import globals from './globals';
import { captureLog } from './sagas/_utils/log';
import { connectedMiddleware } from './middlewares/midConnected';
import { filterMiddleware } from './middlewares/midFilter';
import { lastAction } from './connected/reducers';
import { StoreOptions } from './types/types';
import { StoreStructure } from 'redux-store-generator';
import { StoreBuilder } from './sagas/_utils/StoreBuilder';
import {
    getConnectStoreDefinition,
    getMainStoreDefinition,
} from './storeDefinitions';
import { Middleware } from 'redux';

const CATCH_CONSOLE_LOG = false;

export const generateStore = <T extends StoreStructure>(
    state: T,
    options: Partial<StoreOptions>,
    middlewares: Middleware | Middleware[] = []
): any => {
    globals.structure = state;

    const mainStoreDefinition = getMainStoreDefinition(state);
    const mainStoreBuilder = new StoreBuilder('main');

    globals.adapters = options.adapters;

    mainStoreBuilder
        .withInitialState(mainStoreDefinition.initialState)
        .withReducers(mainStoreDefinition.reducers)
        .withMiddlewares(connectedMiddleware)
        .withMiddlewares(middlewares)
        .withOptions(options);

    globals.mainStore = mainStoreBuilder.build();
    console.log('globals.mainStore ->', globals.mainStore);

    return globals.mainStore;
};

export const generateConnectedStore = <T extends StoreStructure>(
    state: T,
    options: Partial<StoreOptions>
): any => {
    const connectedStoreDefinition = getConnectStoreDefinition(state, options); // prettier-ignore
    const connectedStoreBuilder = new StoreBuilder('connected');

    connectedStoreBuilder
        .withInitialState({ ...connectedStoreDefinition.initialState })
        .withReducers({
            ...connectedStoreDefinition.reducers,
            _lastAction: lastAction,
        })
        .withMiddlewares(filterMiddleware)
        .withSagas('logger', 'requests', 'get', 'save', 'internet');

    globals.connectedStore = connectedStoreBuilder.build();
    console.log('globals.connectedStore ->', globals.connectedStore);

    return globals.connectedStore;
};

if (CATCH_CONSOLE_LOG) {
    captureLog(globals.mainStore);
}
/*
store.dispatch(apiActions.api.config.appState.patch({ requestsPerMinute: 4 }));
store.dispatch(apiActions.api.config.site.patch({ requestsPerMinute: 5 }));
store.dispatch(apiActions.api.config.products.patch({ requestsPerMinute: 6 }));

store.dispatch(apiActions.api.state.appState.patch({ connectionStatus: ConnectionStatus.LOADING })); // prettier-ignore
store.dispatch(apiActions.api.state.site.patch({ connectionStatus: ConnectionStatus.LOADING })); // prettier-ignore
store.dispatch(apiActions.api.state.products.patch({ connectionStatus: ConnectionStatus.LOADING })); // prettier-ignore

store.dispatch(apiActions.api.global.settings.patch({ verifyInternetConnection: true })); // prettier-ignore
store.dispatch(apiActions.api.global.stats.patch({ lastSuccessfulRequestTS: 1 })); // prettier-ignore
*/
