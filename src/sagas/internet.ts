import { logm } from './logger';
import { put, takeEvery } from 'saga-ts';

export function* internet() {
    // checkConnection('https://www.google.com/');
}

function* root() {
    yield put(logm('internet saga on'));
    yield takeEvery('CHECK_INTERNET', internet);
}

export default root;
