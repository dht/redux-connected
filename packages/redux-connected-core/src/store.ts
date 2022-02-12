import globals from './globals';
import { captureLog } from './sagas/_utils/log';
import { connectedMiddleware } from './middlewares/midConnected';
import { StoreDecorator, StoreOptions } from 'redux-connected-types';
import { StoreStructure } from 'redux-store-generator';
import { StoreBuilder } from 'store-builder-redux';
import { getMainStoreDefinition } from './storeDefinitions';
import { Middleware } from 'redux';

const CATCH_CONSOLE_LOG = false;

export const generateStore = <T extends StoreStructure>(
    state: T,
    options: Partial<StoreOptions>,
    middlewares: Middleware | Middleware[] = [],
    storeDecorator?: StoreDecorator
): any => {
    globals.structure = state;

    const mainStoreDefinition = getMainStoreDefinition(state);
    const mainStoreBuilder = new StoreBuilder('main');
    const initialState = { ...mainStoreDefinition.initialState };

    globals.adapters = options.adapters;

    mainStoreBuilder
        .withInitialState(initialState)
        .withReducers(mainStoreDefinition.reducers)
        .withMiddlewares([connectedMiddleware])
        .withMiddlewares(middlewares)
        .withDevtoolsExtensions(options.devtools);

    if (storeDecorator) {
        storeDecorator(mainStoreBuilder);
    }

    globals.mainStore = mainStoreBuilder.build();

    return globals.mainStore;
};

if (CATCH_CONSOLE_LOG) {
    captureLog(globals.mainStore);
}
