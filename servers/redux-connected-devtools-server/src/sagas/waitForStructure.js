import { takeEvery } from 'redux-saga/effects';

export function* waitForStructure(action) {
    console.log('action ->', action);
}

export function* root() {
    yield takeEvery('STORE_STRUCTURE', waitForStructure);
}

export default root;
