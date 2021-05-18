import globals from '../../globals';
import { Action } from 'redux-store-generator';
import {
    ActionWithPromise,
    ConnectionActionResponse,
} from './../../types/types';
import { uuidv4 } from './uuid';

export const dispatchP = (
    action: Action
): Promise<ConnectionActionResponse> => {
    return new Promise((resolve, reject) => {
        const newAction = {
            '@@redux-connected/ACTION_ID': uuidv4(),
            ...action,
            resolve,
            reject,
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
