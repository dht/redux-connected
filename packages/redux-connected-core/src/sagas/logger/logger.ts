import { ActionWithPayload, Log } from 'redux-connected-types';
import { delay, put, takeEvery } from 'redux-saga/effects';
import { Json } from 'redux-store-generator';
import { generateMeta } from '../_utils/meta';

const DEBUG = true;

let sequence = 1;

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

export const logm = (message: string, data: Json = {}) =>
    log({ message, ...data });

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
