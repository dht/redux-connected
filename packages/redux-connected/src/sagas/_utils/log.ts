import { log } from './../logger/logger';

export const captureLog = (store: any) => {
    console.log = function (...params: any) {
        let action;
        if (params.length === 2) {
            const message = (params[0] || '').replace(' ->', '');
            const data = params[1];
            action = log({ message, data });
        } else {
            action = log(params);
        }
        store.dispatch(action);
    };
};
