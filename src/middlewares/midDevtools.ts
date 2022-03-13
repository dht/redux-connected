import { ActionWithPromise } from '../types';
import * as devtools from '../store/devtoolsBridge';

export const devtoolsMiddleware =
    (_store: any) => (next: any) => (action: ActionWithPromise) => {
        devtools.sendAction(action);
        return next(action);
    };
