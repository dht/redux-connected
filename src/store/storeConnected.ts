import globals from '../utils/globals';
import { gatekeeperMiddleware } from '../middlewares/midGatekeeper';
import { getConnectStoreDefinition } from './storeDefinitions';
import { lastAction } from '../store/reducers';
import { Middleware } from 'redux';
import { StoreBuilder } from '../builders/StoreBuilder';
import { StoreDecorator, IReduxConnectedConfig } from '../types';
import { StoreStructure } from 'redux-store-generator';
import sagas from '../sagas';

export const generateConnectedStore = <T extends StoreStructure>(
    state: T,
    options: Partial<IReduxConnectedConfig>,
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
        .withMiddlewares([gatekeeperMiddleware])
        .withMiddlewares(middlewares)
        .withSagas(
            sagas.logger.saga,
            sagas.requests.saga,
            sagas.incoming.saga,
            sagas.postAction.saga,
            sagas.internet.saga,
            sagas.refresh.saga
        );

    if (storeDecorator) {
        storeDecorator(connectedStoreBuilder);
    }

    globals.connectedStore = connectedStoreBuilder.build();

    return globals.connectedStore;
};
