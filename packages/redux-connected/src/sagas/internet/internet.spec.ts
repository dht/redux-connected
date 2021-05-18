import { Action, ApiInfo, ApiVerb } from 'redux-store-generator';
import { put } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { ActionWithPromise } from '../../types/types';

const initialDog = {
    name: 'Tucker',
    age: 11,
};

function reducer(state = initialDog, action: Action) {
    if (action.type === 'HAVE_BIRTHDAY') {
        return {
            ...state,
            age: state.age + 1,
        };
    }

    return state;
}

function* saga() {
    yield put({ type: 'HAVE_BIRTHDAY' });
}

describe('internet', () => {
    it('handles reducers and store state', () => {
        const apiInfo: ApiInfo = {
            verb: 'get',
            nodeName: '',
        };

        const action: ActionWithPromise = {
            type: '',
            resolve: () => {},
            reject: () => {},
        };

        return expectSaga(saga)
            .withReducer(reducer)
            .put({ type: 'HAVE_BIRTHDAY' })
            .run();
    });
});
