import globals from './globals';
import { filterMiddleware } from './middlewares/midFilter';
import { getConnectStoreDefinition } from './storeDefinitions';
import { lastAction } from './connected/reducers';
import { Middleware } from 'redux';
import { StoreBuilder } from 'store-builder-redux';
import { StoreDecorator, StoreOptions } from 'redux-connected-types';
import { StoreStructure } from 'redux-store-generator';
import sagas from './sagas';

export const generateConnectedStore = <T extends StoreStructure>(
    state: T,
    options: Partial<StoreOptions>,
    middlewares: Middleware | Middleware[] = [],
    storeDecorator?: StoreDecorator
): any => {
    const connectedStoreDefinition = getConnectStoreDefinition(state, options); // prettier-ignore
    const connectedStoreBuilder = new StoreBuilder('connected');
    const initialState = { ...connectedStoreDefinition.initialState };

    connectedStoreBuilder.withInitialState(initialState).withReducers({
        ...connectedStoreDefinition.reducers,
        _lastAction: lastAction,
    });

    connectedStoreBuilder
        .withMiddlewares([filterMiddleware])
        .withMiddlewares(middlewares)
        .withDevtoolsExtensions(options.devtools)
        .withSagas(
            sagas.logger.saga,
            sagas.requests.saga,
            sagas.get.saga,
            sagas.save.saga,
            sagas.internet.saga,
            sagas.refresh.saga
        );

    if (storeDecorator) {
        storeDecorator(connectedStoreBuilder);
    }

    globals.connectedStore = connectedStoreBuilder.build();

    return globals.connectedStore;
};
