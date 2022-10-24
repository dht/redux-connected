import { log } from '../sagas/logger';

export const captureLog = (store: any) => {
    console.log = function (...params: any) {
        let action;
        if (params.length === 2) {
            const message = (params[0] ?? '').replace(' ->', '');
            const data = params[1];
            action = log({ message, data });
        } else {
            action = log(params);
        }
        store.dispatch(action);
    };
};

const ts = () => new Date().getTime();
const now = ts();
export const timeDelta = () => ((ts() - now) / 1000).toFixed(3);

export const logRequests = (requests: any[], id: string) => {
    if (requests.length === 0) {
        return;
    }

    console.log(
        timeDelta(),
        id,
        requests.map((r) => r.id.substring(0, 4) + '_' + r.requestStatus)
    );
};
