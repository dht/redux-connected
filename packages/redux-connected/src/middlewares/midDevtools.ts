import { ActionWithPromise } from '../types/types';
import * as sockets from '../sagas/_utils/sockets';

export const devtoolsMiddleware =
    (storeId: string) =>
    (_store: any) =>
    (next: any) =>
    (action: ActionWithPromise) => {
        sockets.emit('action', {
            storeId,
            action,
        });

        return next(action);
    };
