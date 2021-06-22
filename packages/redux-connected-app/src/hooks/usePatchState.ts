import { useCallback, useState } from 'react';

type UsePatchStateReturn<T> = [
    T,
    (change: T) => void,
    {
        set: (newState: T) => void;
    }
];

export function usePatchState<T>(initialState: T): UsePatchStateReturn<T> {
    const [state, setState] = useState<T>(initialState);

    const patch = useCallback(
        (change: T) => {
            setState({
                ...state,
                ...change,
            });
        },
        [state]
    );

    const set = useCallback(
        (newState: T) => {
            setState(newState);
        },
        [setState]
    );

    return [state, patch, { set }];
}
