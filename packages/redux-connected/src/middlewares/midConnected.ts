import { Action } from 'redux-store-generator';
import dispatchP from '../sagas/_utils/dispatchP';

export const connectedMiddleware =
    () => (next: any) => async (action: Action) => {
        const actionResponse = await dispatchP(action);

        if (actionResponse.nextAction) {
            next(actionResponse.nextAction);
        }

        return actionResponse.response;
    };
