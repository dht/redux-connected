import { createSelector } from 'reselect';
import { MyStore } from './initialState';

export const $i = (state: MyStore) => state;

export const $rawAppState = createSelector($i, (state) => state.appState);
export const $rawUser = createSelector($i, (state) => state.user);
export const $rawProducts = createSelector($i, (state) => state.products);
export const $rawLogs = createSelector($i, (state) => state.logs);
export const $rawChats = createSelector($i, (state) => state.chats);

export const selectors = {
    $rawAppState,
    $rawUser,
    $rawProducts,
    $rawLogs,
    $rawChats,
};
