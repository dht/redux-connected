import { useEffect } from 'react';
import { Action } from 'redux-store-generator';
import globals from '../globals';

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
        const store = globals.connectedStore;

        if (!store) {
            return;
        }

        console.log('store ->', store);

        const unsubscribe = store.subscribe(() => {
            const state = store.getState();
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
