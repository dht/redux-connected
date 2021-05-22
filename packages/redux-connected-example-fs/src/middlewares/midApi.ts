import { actions, connectedStore, store } from './../redux/store';
import { routeToAction } from 'redux-connected';
import { ApiResponse } from 'redux-connected/lib/types/types';
import { Json } from 'redux-store-generator';

export const middlewareApi = () => async (req: any, res: any, next: any) => {
    const state = connectedStore.getState();

    const { path, method } = req;
    const entity = path.split('/')[1];

    const nodeType = state._api.nodeTypes[entity];

    const actionConfig = routeToAction(method, path, nodeType);
    const { nodeName, verb, id } = actionConfig;
    const actionCreator = (actions as any)[nodeName][verb];

    const args = routeToParams(method, path, nodeType, req.query, req.body);
    const action = actionCreator(...args);

    console.log('action ->', action);

    const result: ApiResponse = await store.dispatch(action);

    res.status(result.status || 200).json(result.data);

    next();
};
