import { StoreDefinition, IReduxConnectedConfig } from '../types';
import {
    generateReducersForStore,
    StoreStructure,
    cleanInitialState,
} from 'redux-store-generator';
import { generateApiReducersForStore } from './reducers';
import { generateInitialState } from './initialState';

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
    options: Partial<IReduxConnectedConfig>
): Partial<StoreDefinition> => {
    const initialState = {
        _api: generateInitialState<T>(state, options),
    };

    const apiReducers = generateApiReducersForStore();

    return {
        initialState,
        reducers: {
            ...apiReducers,
        },
    };
};
