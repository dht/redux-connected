import { apiActions } from '../store/actions';
import { put, takeEvery } from './_helpers';

export function* refresh() {
    try {
        yield put(apiActions.api.requests.clear());
    } catch (e) {
        console.log('e ->', e);
    }
}

function* root() {
    yield takeEvery('REFRESH', refresh);
}

export default root;
