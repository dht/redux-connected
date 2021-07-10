import { generateActionsForStore, generateReducersForStore } from 'redux-store-generator';
import { state } from './initialState';

export const lastAction = (_state: any, action: any) => {
    // tslint:disable:no-unused-variable
    return action;
};

export const extraReducers = {
    ...generateReducersForStore(state),
    _lastAction: lastAction,
};

export const actions = generateActionsForStore(state);
