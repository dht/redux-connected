import { ActionWithPayload } from '../types';
import dispatchP from '../utils/dispatchP';

export const connectedMiddleware =
    () => (next: any) => async (action: ActionWithPayload<any>) => {
        const actionResponse = await dispatchP(action);

        if (actionResponse.nextAction) {
            next(actionResponse.nextAction);
        }

        return actionResponse.response;
    };
