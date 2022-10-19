import { ActionWithPayload, Log } from '../types';
import { delay, put, takeEvery } from 'saga-ts';
import { generateMeta } from '../utils/meta';

const DEBUG = true;

let sequence = 1;

type Json = Record<string, any>;

export const log = (payload: Json): ActionWithPayload<Log> => {
    const meta = generateMeta(sequence++);

    return {
        type: 'LOG',
        payload: {
            meta,
            ...payload,
        },
    };
};

export const logm = (message: string, data: Json = {}) => {
    // console.log(message, data);
    return log({ message, ...data });
};

function* logger() {
    yield delay(0);
    if (!DEBUG) {
        return;
    }
}

function* root() {
    yield takeEvery('LOG', logger);
    yield put(logm('logger saga on', {}));
}

export default root;
