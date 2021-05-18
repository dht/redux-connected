import { StoreDefinition, StoreOptions } from './types/types';
import {
    generateReducersForStore,
    StoreStructure,
    cleanInitialState,
} from 'redux-store-generator';
import {
    generateApiReducersForStore,
    generateSagasReducersForStore,
} from './connected/reducers';
import {
    generateInitialState,
    generateSagasInitialState,
} from './initialState';
import sagas from './sagas';

export const getMainStoreDefinition = <T extends StoreStructure>(
    state: T
): Partial<StoreDefinition> => {
    const initialState = cleanInitialState(state);
    const reducers = generateReducersForStore(state);

    return {
        initialState,
        reducers,
    };
};

export const getConnectStoreDefinition = <T extends StoreStructure>(
    state: T,
    options: Partial<StoreOptions>
): Partial<StoreDefinition> => {
    const initialState = {
        _api: generateInitialState<T>(state, options),
        _sagas: generateSagasInitialState(sagas),
    };

    const apiReducers = generateApiReducersForStore();
    const sagasReducers = generateSagasReducersForStore();

    return {
        initialState,
        reducers: {
            ...apiReducers,
            ...sagasReducers,
        },
    };
};
