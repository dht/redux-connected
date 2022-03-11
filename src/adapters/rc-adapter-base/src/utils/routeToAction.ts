import { Json, NodeType } from 'redux-store-generator';
import { HttpMethod } from '../../../../types';

export type ActionConfig = {
    nodeName: string;
    verb: string;
    id?: string;
};

export type Args = [number, Json] | [Json] | [];

export type RequestInfo = {
    verb: HttpMethod;
    path: string;
    nodeType: NodeType;
    query?: Json;
    body?: Json;
    id?: string;
};

export const routeToAction = (
    verb: HttpMethod,
    path: string,
    nodeType: NodeType
): ActionConfig => {
    switch (nodeType) {
        case NodeType.SINGLE_NODE:
            return routeToActionSingle(verb, path);
        case NodeType.QUEUE_NODE:
            return routeToActionQueue(verb, path);
        case NodeType.COLLECTION_NODE:
            return routeToActionCollection(verb, path);
        case NodeType.GROUPED_LIST_NODE:
            return routeToActionGroupedList(verb, path);
    }
};

const routeToActionSingle = (verb: HttpMethod, path: string) => {
    let output = {} as any;

    output.nodeName = path.replace('/', '');

    switch (verb) {
        case 'GET':
            output.verb = 'get';
            break;
        case 'POST':
            output.verb = 'setAll';
            break;
        case 'PATCH':
            output.verb = 'patch';
            break;
    }

    return output;
};

const routeToActionQueue = (verb: HttpMethod, path: string) => {
    let output = {} as any;

    output.nodeName = path.replace('/', '');

    switch (verb) {
        case 'GET':
            output.verb = 'get';
            break;
        case 'PUT':
            output.verb = 'setAll';
            break;
        case 'POST':
            output.verb = 'push';
            break;
        case 'DELETE':
            output.verb = 'clear';
            break;
    }

    return output;
};

const routeToActionCollection = (verb: HttpMethod, path: string) => {
    let output = {} as any;

    const parts = path.split('/');

    output.nodeName = parts[1];

    if (parts[2]) {
        output.id = parts[2];
    }

    switch (verb) {
        case 'GET':
            output.verb = 'get';
            break;
        case 'PUT':
            output.verb = 'setAll';
            break;
        case 'POST':
            output.verb = 'add';
            break;
        case 'PATCH':
            output.verb = 'patch';
            break;
        case 'DELETE':
            output.verb = 'delete';
            break;
    }

    return output;
};

const routeToActionGroupedList = (verb: HttpMethod, path: string) => {
    let output = {} as any;

    const parts = path.split('/');

    output.nodeName = parts[1];

    if (parts[2]) {
        output.id = parts[2];
    }

    const isItems = parts[3] === 'items';

    switch (verb) {
        case 'GET':
            output.verb = !isItems ? 'get' : 'getItems';
            break;
        case 'PUT':
            output.verb = !isItems ? 'setAll' : 'setItems';
            break;
        case 'POST':
            output.verb = !isItems ? 'add' : 'pushItem';
            break;
        case 'PATCH':
            output.verb = 'patch';
            break;
        case 'DELETE':
            output.verb = !isItems ? 'delete' : 'clearItems';
            break;
    }

    return output;
};
