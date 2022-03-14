import globals from './globals';
import { actions } from '../store/actions';
import { ApiRequest } from '../types';
import { LiveObject } from './liveObject';

export const createLiveRequest = (request: ApiRequest) => {
    const liveObject: any = new LiveObject<ApiRequest>(request, (change) => {
        const action = actions.requests.patch(request.id, change);
        // console.log('action ->', JSON.stringify(action, null, 4));
        globals.connectedStore.dispatch(action);
    });

    return liveObject as ApiRequest;
};

export const createLiveRequests = (requests: ApiRequest[]) => {
    return requests.map((request) => createLiveRequest(request));
};

export const getLiveRequests = (selector: any) => {
    const data: ApiRequest[] = selector(globals.connectedStore.getState());
    return createLiveRequests(data);
};
