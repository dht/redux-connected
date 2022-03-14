import * as devtools from '../utils/devtoolsBridge';
import globals from '../utils/globals';
import sagas from '../sagas';
import { cleanInitialState, generateInitialState } from './initialState';
import { ConnectedStore, IReduxConnectedConfig } from '../types';
import { devtoolsMiddleware } from '../middlewares/midDevtools';
import { gatekeeperMiddleware } from '../middlewares/midGatekeeper';
import { Middleware } from 'redux';
import { StoreBuilder } from '../builders/StoreBuilder';
import { Action, generateReducersForStore, StoreStructure } from 'redux-store-generator'; // prettier-ignore

export const generateConnectedStore = <T extends StoreStructure>(
    state: T,
    config: Partial<IReduxConnectedConfig>,
    middlewares: Middleware | Middleware[] = []
): any => {
    const connectedStoreBuilder = new StoreBuilder('connected');
    const schema = generateInitialState(state, config);

    connectedStoreBuilder
        .withReducers({
            ...generateReducersForStore<ConnectedStore>(schema),
        })
        .withReducers({
            _lastAction,
        })
        .withMiddlewares([gatekeeperMiddleware])
        .withMiddlewares(middlewares)
        .withSagas(
            sagas.requests.saga,
            sagas.incoming.saga,
            sagas.postAction.saga,
            sagas.houseKeeping.saga
        );

    const initialState = cleanInitialState(schema);

    connectedStoreBuilder.withInitialState(initialState);

    if (config.enableReduxDevtools) {
        connectedStoreBuilder.withMiddlewares(devtoolsMiddleware);
    }

    if (config.enableReduxDevtools) {
        connectedStoreBuilder.withPostBuildHook((_store) => {
            devtools.sendState(_store.getState());
        });
    }

    globals.connectedStore = connectedStoreBuilder.build();

    return globals.connectedStore;
};

export const generateConnectedStoreEmpty = <T extends StoreStructure>(
    state: T,
    config: Partial<IReduxConnectedConfig>
): any => {
    const connectedStoreBuilder = new StoreBuilder('connected');
    const initialState = generateInitialState(state, config);

    connectedStoreBuilder
        .withInitialState(initialState)
        .withReducers({
            ...generateReducersForStore<ConnectedStore>(initialState),
        })
        .withReducers({
            _lastAction,
        });

    return connectedStoreBuilder.build();
};

// https://github.com/reduxjs/redux/issues/580#issuecomment-133188511
export const _lastAction = (_state: any, action: Action) => {
    return action;
};
