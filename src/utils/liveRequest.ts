import globals from './globals';
import { actions } from '../store/actions';
import { ApiRequest } from '../types';
import { createLiveObject } from './liveObject';

export const createLiveRequest = (request: ApiRequest) => {
    return createLiveObject<ApiRequest>(request, (change) => {
        const action = actions.requests.patch(request.id, change);
        globals.connectedStore.dispatch(action);
    });
};

export const createLiveRequests = (requests: ApiRequest[]) => {
    return requests.map((request) => createLiveRequest(request));
};

export const getLiveRequests = (selector: any) => {
    const data: ApiRequest[] = selector(globals.connectedStore.getState());
    return createLiveRequests(data);
};
