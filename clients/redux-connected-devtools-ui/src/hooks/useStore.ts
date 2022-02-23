import { connectedStore } from '../store/store';
import { useEffect, useCallback } from 'react';
import { Action } from 'redux-store-generator';

type StoreReading = {
    state: any;
    action: Action;
};

export type StoreChangeCallback = (storeReading: StoreReading) => void;
export type ActionPredicate = (action: Action) => boolean;

export function useStore(
    callback: StoreChangeCallback,
    predicate?: ActionPredicate
) {
    useEffect(() => {
        const unsubscribe = connectedStore.subscribe(() => {
            const state = connectedStore.getState();
            const action = state._lastAction;

            if (!predicate || predicate(action)) {
                callback({
                    state,
                    action,
                });
            }
        });

        return () => unsubscribe();
    }, [callback, predicate]);
}

export function onStoreAction(
    actionType: string,
    callback: StoreChangeCallback
) {
    useStore(callback, (action: Action) => action.type === actionType);
}

export function onStoreRefreshRequest(callback: StoreChangeCallback) {
    onStoreAction('REFRESH', callback);
}
