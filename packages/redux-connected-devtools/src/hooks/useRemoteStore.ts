import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { getConnectStoreDefinition, getMainStoreDefinition } from 'redux-connected';
import { useCallback, useState } from 'react';
import { useSockets } from './useSockets';

export function useRemoteStore(url: string, storeId: string) {
    const [store, setStore] = useState<any>(null);

    const dispatch = useCallback(
        (action: any) => {
            store.dispatch(action);
        },
        [store],
    );

    useSockets(url, `${storeId}_devtoolsState`, (state: any) => {
        const definition =
            storeId === 'connectedStore' ? getConnectStoreDefinition(state, {}) : getMainStoreDefinition(state);

        const rootReducer = combineReducers({ ...definition.reducers });
        const _store = createStore(rootReducer, definition.initialState, composeWithDevTools(applyMiddleware()));
        setStore(_store);
    });

    useSockets(url, `${storeId}_devtoolsAction`, dispatch, [store]);

    return [store];
}
