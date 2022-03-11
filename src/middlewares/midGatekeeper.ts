import { setActionLogLifecycle } from '../store/quickActions';
import { ApiInfo } from 'redux-store-generator';
import * as selectors from '../store/selectors';
import { ActionLifecycle, ActionWithPromise, ConnectionType } from '../types';
import { clearActionP } from '../utils/dispatchP';

/*
    Gatekeeper for the RC store
*/

export const gatekeeperMiddleware =
    (store: any) => (next: any) => (action: ActionWithPromise) => {
        let skip = false;

        const state = store.getState();

        const actionTypes = selectors.$actionTypes(state);
        const apiInfo: ApiInfo = actionTypes[action.type];

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
            if (action.actionLogId) {
                store.dispatch(setActionLogLifecycle(action.actionLogId, ActionLifecycle.FILTERED)); // prettier-ignore
            }

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
