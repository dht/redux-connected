import { ActionWithPromise, Reading } from '../types/types';
import { useCounter, useList } from 'react-use';
import { Action } from 'redux-store-generator';
import { useStore, ActionPredicate } from './useStore';
import { generateMeta } from '../sagas/_utils/meta';

export interface UseMonitorOptions {
    monitorState?: boolean;
    onlyLast?: boolean;
}

export type UseMonitorReturnType = [Reading[], { clear: () => void }];

export function useMonitor(
    options?: UseMonitorOptions,
    predicate?: ActionPredicate
) {
    const [sequence, { inc }] = useCounter(1);
    const [readings, { push, clear }] = useList<Reading>([]);
    const { onlyLast } = options || {};

    useStore(({ state, action }) => {
        inc();

        const reading: Reading = {
            meta: generateMeta(sequence),
            action: cleanAction(action as ActionWithPromise),
        };

        if (options && options.monitorState) {
            reading.state = state;
        }

        if (onlyLast) {
            clear();
        }

        push(reading);
    }, predicate);

    return [readings, { clear }] as UseMonitorReturnType;
}

function cleanAction(action: ActionWithPromise): Action {
    const output = { ...action };
    delete output['resolve'];
    delete output['reject'];
    return output;
}
