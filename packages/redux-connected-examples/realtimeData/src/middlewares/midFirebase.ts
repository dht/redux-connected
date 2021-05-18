import { Action } from 'redux-store-generator';

export const firebaseMiddleware = (store: any) => (next: any) => (
    action: Action
) => {
    let result = next(action);
    return result;
};
