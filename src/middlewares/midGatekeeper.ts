import { ApiInfo } from 'redux-store-generator';
import * as selectors from '../store/selectors';
import { ActionWithPromise, ApiRequest, ConnectionType } from '../types';
import { clearActionP } from '../utils/dispatchP';
import { RequestBuilder } from '../utils/RequestBuilder';

/*
    Gatekeeper for the RC store
*/

export const gatekeeperMiddleware =
    (store: any) => (next: any) => (action: ActionWithPromise) => {
        let skip = false;

        const state = store.getState();

        const actionTypes = selectors.$actionTypes(state);
        const apiInfo: ApiInfo = actionTypes[action.type];

        const request: ApiRequest = new RequestBuilder()
            .withOriginalAction(action)
            .build();

        yield addNewRequest(request);
        yield put(actions.addRequestJourneyPoint(request, 'in queue'));

        if (apiInfo) {
            const allConfigs = selectors.$endpointsConfig(state);
            const { nodeName, isLocal } = apiInfo;
            const config = allConfigs[nodeName];
            const { connectionType } = config;

            // connectionType not defined
            if (connectionType === ConnectionType.NONE) {
                skip = true;
            }

            // local action
            if (isLocal) {
                skip = true;
            }
        } else {
            // action is foreign
            if (action['@@redux-connected/ACTION_ID']) {
                skip = true;
            }
        }

        if (skip) {
            const nextAction = clearActionP(action);
            if (!action.resolve) {
                console.warn('no action resolve');
                return;
            }
            action.resolve({ nextAction });
            return;
        }

        return next(action);
    };
