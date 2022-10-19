import { apiActions } from '../store/actions';
import { put, takeEvery } from 'saga-ts';

export function* refresh() {
    try {
        yield put(apiActions.api.requests.clear());
        yield put(apiActions.api.actionLogs.clear());
    } catch (e) {
        console.log('e ->', e);
    }
}

function* root() {
    yield takeEvery('REFRESH', refresh);
}

export default root;
