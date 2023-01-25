import { actionToApiRequest } from '../utils/actions';
import globals from '../utils/globals';

export const cacheMiddleware =
    (store: any) => (next: any) => async (action: any) => {
        const apiRequest = actionToApiRequest(
            action,
            globals.connectedStore.getState()
        );

        if (apiRequest.isLocalSet && !apiRequest.echo) {
            globals.adapters.indexedDb.fireRequest(apiRequest);
        }

        let result = next(action);
        return result;
    };
