import { createActionLog } from '../store/quickActions';
import globals from './globals';
import { Action } from 'redux-store-generator';
import {
    ActionWithPromise,
    ConnectionActionResponse,
    ActionWithPayload,
} from '../types';
import { uuidv4 } from './uuid';
import { ActionLogBuilder } from './ActionLogBuilder';

export const dispatchP = (
    action: ActionWithPayload<any>
): Promise<ConnectionActionResponse> => {
    return new Promise((resolve, reject) => {
        const actionLog = new ActionLogBuilder()
            .withAction(action)
            .withJourneyPoint('created')
            .build();

        globals.connectedStore.dispatch(createActionLog(actionLog));

        const newAction: ActionWithPromise = {
            '@@redux-connected/ACTION_ID': uuidv4(),
            ...action,
            resolve,
            reject,
            actionLogId: actionLog.meta.id,
        };

        globals.connectedStore.dispatch(newAction);
    });
};

export function clearActionP(action: ActionWithPromise): Action {
    const output: ActionWithPromise = { ...action };
    delete output['resolve'];
    delete output['reject'];
    return output;
}

export default dispatchP;
