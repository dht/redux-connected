import { takeEvery } from 'redux-saga/effects';
import { resetTimestamp } from '../../utils/time';

export function* reset() {
    resetTimestamp();
}

export function* root() {
    yield takeEvery(['CLEAR_REQUESTS', 'CLEAR_ACTION_LOGS'], reset);
}

export default root;
