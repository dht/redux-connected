import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { actions, extraReducers } from './../redux/extraReducers';
import { getConnectStoreDefinition, getMainStoreDefinition } from 'redux-connected';
import { timelineEmpty } from './../redux/timeline';
import { useCallback, useState } from 'react';
import { useSockets } from './useSockets';

let counter = 1;

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

        const rootReducer = combineReducers({
            ...definition.reducers,
            ...extraReducers,
        });

        const initialState = {
            ...definition.initialState,
            timeline: timelineEmpty,
        };

        const _store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware()));

        setStore(_store);
    });

    useSockets(url, `${storeId}_devtoolsAction`, dispatch, [store]);

    useSockets(
        url,
        'devtoolsTimelineEvent',
        (event: any) => {
            const { timelineId, data } = event;

            const item = {
                timestamp: new Date().getTime(),
                counter: counter++,
                ...data,
            };

            store.dispatch(actions.timeline.pushItem(timelineId, item));
        },
        [store],
    );

    return [store];
}
