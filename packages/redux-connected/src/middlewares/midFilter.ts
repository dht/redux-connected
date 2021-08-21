import { emitTimelineEvent } from '../sagas/_utils/sockets';
import { ApiInfo } from 'redux-store-generator';
import * as selectors from '../selectors/selectors';
import { ActionWithPromise, ConnectionType } from '../types/types';
import { clearActionP } from '../sagas/_utils/dispatchP';

export const filterMiddleware =
    (store: any) => (next: any) => (action: ActionWithPromise) => {
        let skip = false;

        const state = store.getState();

        const actionTypes = selectors.$actionTypes(state);
        const apiInfo: ApiInfo = actionTypes[action.type];

        if (apiInfo) {
            const allConfigs = selectors.$config(state);
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

        if (action['@@redux-store-generator/AUTO_GENERATED_ACTION']) {
            emitTimelineEvent('midFilter', { action });
        }

        return next(action);
    };
