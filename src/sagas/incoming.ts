import { actions } from '../store/actions';
import { ApiInfo } from 'redux-store-generator';
import { clearActionP } from '../utils/dispatchP';
import { actionToApiRequest } from '../utils/actions';
import { put, select, takeEvery } from 'saga-ts';
import { selectors } from '../store/selectors';
import {
    ActionWithPromise,
    ApiRequest,
    ConnectionType,
    LifecycleStatus,
    SagaEvents,
} from '../types';

function* incoming(action: ActionWithPromise) {
    try {
        const state = yield* select(selectors.$all);

        const request: ApiRequest = actionToApiRequest(action, state);

        if (request.isSilent) {
            if (typeof action.resolve === 'function') {
                action.resolve(clearActionP(action));
            }
            return;
        }

        if (
            request.argsConnectionType === ConnectionType.NONE ||
            !request.argsConnectionType
        ) {
            if (typeof action.resolve === 'function') {
                action.resolve({ ignored: true });
            }
            return;
        }

        yield put(actions.requests.set(request.id, request));

        yield put(
            actions.addRequestJourneyPoint(
                request,
                LifecycleStatus.RECEIVED,
                clearActionP(action)
            )
        );

        if (request.optimisticCurrent) {
            yield put({
                type: SagaEvents.POST_ACTION,
                request,
                response: request.argsParams,
                isOptimistic: true,
            });
        }
    } catch (e) {
        console.log('e ->', e);
    }
}

function* root() {
    try {
        const actionTypesRaw = yield* select(selectors.$actionTypesRaw);
        const actionTypes = Object.keys(actionTypesRaw).filter((key) => {
            const apiInfo: ApiInfo = actionTypesRaw[key];
            return !apiInfo.isLocal;
        });

        yield takeEvery(actionTypes, incoming);
    } catch (e) {
        console.log('e ->', e);
    }
}

export default root;
