import { JourneyPoint, Json } from 'redux-connected-types';
import { Action, NodeType } from 'redux-store-generator';

interface Single {
    nodeType?: NodeType;
}

export const generateConfigReducer = <T extends Single>(configName: string) => {
    const config = (state: T, action: Action) => {
        let newState = {} as any;

        switch (action.type) {
            case `SET_${configName}`:
                newState = {
                    ...action.payload,
                };

                if (state.nodeType) {
                    newState.nodeType = state.nodeType;
                }

                return newState;
            case `PATCH_${configName}`:
                newState = {
                    ...state,
                    ...action.payload,
                };

                if (state.nodeType) {
                    newState.nodeType = state.nodeType;
                }

                return newState;
        }
    };

    const configs = (state: T, action: Action) => {
        let newState = {} as any,
            newAction = {} as any,
            payload = {} as any;

        switch (action.type) {
            case `SET_ALL_${configName}`:
                return action.payload;
            case `SET_${configName}`:
            case `PATCH_${configName}`:
                newState = { ...state };
                payload = action.payload || {};
                Object.keys(payload).forEach((key) => {
                    newAction = { ...action, payload: payload[key] };
                    newState[key] = config(newState[key], newAction);
                });
                return newState;
            default:
                return state || {};
        }
    };

    return configs;
};

export const generateListReducer = <T extends Json>(nodeName: string) => {
    const single = (state: T, action: Action) => {
        const { payload } = action;
        const { item, point } = payload!;

        // mutability, an anti-pattern in most cases,
        // here it allows us to avoid rendering the action after every change
        // this is useful as requests/actionLogs are highly volatile
        switch (action.type) {
            case `PATCH_${nodeName}`:
                Object.keys(item).forEach((key) => {
                    (state as any)[key] = item[key];
                });
                return state;
            case `ADD_${nodeName}_JOURNEY_POINT`:
                state.journey.push(point as JourneyPoint);
                return state;
            default:
                return state;
        }
    };

    const list = (state: T[], action: Action) => {
        const { payload } = action;
        const { id } = payload || {};

        let newState = [] as any,
            index;

        switch (action.type) {
            case `PUSH_${nodeName}`:
                return [...state, action.payload];
            case `ADD_${nodeName}_JOURNEY_POINT`:
            case `PATCH_${nodeName}`:
                newState = [...state];
                index = state.findIndex((item) => item.meta.id === id);
                if (index >= 0) {
                    newState[index] = single(newState[index], action);
                }
                return newState;
            case `REMOVE_${nodeName}`:
                newState = [...state];
                index = state.findIndex((item) => item.meta.id === id);
                if (index >= 0) {
                    newState.splice(index, 1);
                }
                return newState;
            case `PURGE_COMPLETED_${nodeName}S`:
                return state.filter((item: T) => !item.isCompleted);
            case `CLEAR_${nodeName}S`:
                return [];
            default:
                return state || [];
        }
    };

    return list;
};
