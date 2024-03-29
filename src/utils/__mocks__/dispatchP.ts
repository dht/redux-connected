import {
    ConnectionActionResponse,
    ApiResponse,
    ActionWithPromise,
} from '../../types';
import { Action } from 'redux-store-generator';

export const dispatchP = (): Promise<ConnectionActionResponse> => {
    return new Promise((resolve) => {
        resolve({
            nextAction: { type: 'NEXT_ACTION' },
            response: {
                data: {},
            } as ApiResponse,
        });
    });
};

export function clearActionP(action: ActionWithPromise): Action {
    const output: ActionWithPromise = { ...action };
    delete output['resolve'];
    delete output['reject'];
    return output;
}

export default dispatchP;
