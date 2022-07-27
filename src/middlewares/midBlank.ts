import { ActionWithPromise } from '../types';

export const blankMiddleware =
    (_store: any) => (next: any) => (action: ActionWithPromise) => {
        return next(action);
    };
