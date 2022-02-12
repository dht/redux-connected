import { ActionWithPayload } from 'redux-connected-types';
import dispatchP from '../sagas/_utils/dispatchP';

export const connectedMiddleware =
    () => (next: any) => async (action: ActionWithPayload<any>) => {
        const actionResponse = await dispatchP(action);

        if (actionResponse.nextAction) {
            next(actionResponse.nextAction);
        }

        return actionResponse.response;
    };
