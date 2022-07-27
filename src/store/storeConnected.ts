import * as devtools from '../utils/devtoolsBridge';
import globals from '../utils/globals';
import sagas from '../sagas';
import { devtoolsMiddleware } from '../middlewares/midDevtools';
import { gatekeeperMiddleware } from '../middlewares/midGatekeeper';
import { getConnectStoreDefinition } from './storeDefinitions';
import { IReduxConnectedConfig, StoreDecorator } from '../types';
import { lastAction } from '../store/reducers';
import { Middleware } from 'redux';
import { StoreBuilder } from '../builders/StoreBuilder';
import { StoreStructure } from 'redux-store-generator';

export const generateConnectedStore = <T extends StoreStructure>(
    state: T,
    config: Partial<IReduxConnectedConfig>,
    middlewares: Middleware | Middleware[] = [],
    storeDecorator?: StoreDecorator
): any => {
    const connectedStoreDefinition = getConnectStoreDefinition(state, config); // prettier-ignore
    const connectedStoreBuilder = new StoreBuilder('connected');
    const initialState = { ...connectedStoreDefinition.initialState };

    connectedStoreBuilder.withInitialState(initialState).withReducers({
        ...connectedStoreDefinition.reducers,
        _lastAction: lastAction,
    });

    connectedStoreBuilder
        .withMiddlewares([gatekeeperMiddleware])
        .withMiddlewares(devtoolsMiddleware)
        .withMiddlewares(middlewares)
        .withSagas(
            sagas.logger.saga,
            sagas.requests.saga,
            sagas.incoming.saga,
            sagas.postAction.saga,
            sagas.internet.saga,
            sagas.refresh.saga
        );

    if (config.enableReduxDevtools) {
        connectedStoreBuilder.withPostBuildHook((_store) => {
            devtools.sendState(_store.getState());
        });
    }

    if (storeDecorator) {
        storeDecorator(connectedStoreBuilder);
    }

    globals.connectedStore = connectedStoreBuilder.build();

    return globals.connectedStore;
};

export const generateConnectedStoreEmpty = <T extends StoreStructure>(
    state: T,
    options: Partial<IReduxConnectedConfig>
): any => {
    const connectedStoreDefinition = getConnectStoreDefinition(state, options); // prettier-ignore
    const connectedStoreBuilder = new StoreBuilder('connected');
    const initialState = { ...connectedStoreDefinition.initialState };

    connectedStoreBuilder.withInitialState(initialState).withReducers({
        ...connectedStoreDefinition.reducers,
        _lastAction: lastAction,
    });

    return connectedStoreBuilder.build();
};
