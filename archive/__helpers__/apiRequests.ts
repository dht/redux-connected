import { Json, NodeType } from 'redux-store-generator';
import { ApiRequest, ApiRequestStatus } from '../types/types';

const _base = {
    meta: {
        id: '',
        shortId: '',
        createdTS: 0,
        sequence: 1,
    },
    status: ApiRequestStatus.IDLE,
};

export const single = {
    _base: {
        ..._base,
        nodeName: 'user',
        nodeType: NodeType.SINGLE_NODE,
        path: '/user',
    },
    get: (): ApiRequest => ({
        ...single._base,
        method: 'GET',
        apiVerb: 'get',
    }),
    patch: (change: Json): ApiRequest => ({
        ...single._base,
        method: 'PATCH',
        apiVerb: 'patch',
        params: change,
    }),
};

export const queue = {
    _base: (name: string) => ({
        ..._base,
        nodeName: name,
        nodeType: NodeType.QUEUE_NODE,
        path: `/${name}`,
    }),
    get: (name: string = 'logs'): ApiRequest => ({
        ...queue._base(name),
        method: 'GET',
        apiVerb: 'get',
    }),
    push: (item: Json, name: string = 'logs'): ApiRequest => ({
        ...queue._base(name),
        method: 'POST',
        apiVerb: 'push',
        params: {
            item,
        },
    }),
    clear: (name: string = 'logs'): ApiRequest => ({
        ...queue._base(name),
        method: 'DELETE',
        apiVerb: 'clear',
        path: `/${name}`,
    }),
    pop: (name: string = 'logs'): ApiRequest => ({
        ...queue._base(name),
        method: 'DELETE',
        apiVerb: 'pop',
    }),
};

export const collection = {
    _base: (name: string) => ({
        ..._base,
        nodeName: name,
        nodeType: NodeType.COLLECTION_NODE,
        path: `/${name}`,
    }),
    get: (name: string = 'products'): ApiRequest => ({
        ...collection._base(name),
        method: 'GET',
        apiVerb: 'get',
    }),
    add: (item: Json, name: string = 'products'): ApiRequest => ({
        ...collection._base(name),
        method: 'POST',
        apiVerb: 'add',
        params: {
            item,
        },
    }),
    patch: (
        doc: string,
        change: Json,
        name: string = 'products'
    ): ApiRequest => ({
        ...collection._base(name),
        method: 'PATCH',
        apiVerb: 'patch',
        path: `/${name}/${doc}`,
        params: {
            change,
        },
    }),
    delete: (doc: string, name: string = 'products'): ApiRequest => ({
        ...collection._base(name),
        method: 'DELETE',
        apiVerb: 'delete',
        path: `/${name}/${doc}`,
    }),
    clear: (name: string = 'products'): ApiRequest => ({
        ...queue._base(name),
        method: 'DELETE',
        apiVerb: 'clear',
        path: `/${name}`,
    }),
};

export const collectionQuery = {
    _base: (name: string) => ({
        ..._base,
        nodeName: name,
        nodeType: NodeType.COLLECTION_NODE,
        path: `/${name}`,
    }),
    getQuery: (
        field: string,
        value: any,
        name: string = 'products'
    ): ApiRequest => ({
        ...collectionQuery._base(name),
        method: 'GET',
        apiVerb: 'get',
        params: {
            q: {
                field,
                value,
            },
        },
    }),
    getSort: (
        field: string,
        order: string,
        name: string = 'products'
    ): ApiRequest => ({
        ...collectionQuery._base(name),
        method: 'GET',
        apiVerb: 'get',
        params: {
            orderBy: {
                field,
                order,
            },
        },
    }),
    getLimit: (limit: number, name: string = 'products'): ApiRequest => ({
        ...collectionQuery._base(name),
        method: 'GET',
        apiVerb: 'get',
        params: {
            limit,
        },
    }),
    getFilter: (
        field: string,
        relation: string,
        value: any,
        name: string = 'products'
    ): ApiRequest => ({
        ...collectionQuery._base(name),
        method: 'GET',
        apiVerb: 'get',
        params: {
            filters: [
                {
                    field,
                    relation,
                    value,
                },
            ],
        },
    }),
    getPagination: (
        isNext: boolean,
        name: string = 'products'
    ): ApiRequest => ({
        ...collectionQuery._base(name),
        method: 'GET',
        apiVerb: 'get',
        params: {
            orderBy: {
                field: 'price',
                order: 'desc',
            },
            filters: [
                {
                    field: 'price',
                    relation: '>=',
                    value: 300,
                },
            ],
            limit: 10,
            isNext,
        },
    }),
};

export const groupedList = {
    _base: (name: string) => ({
        ..._base,
        nodeName: name,
        nodeType: NodeType.GROUPED_LIST_NODE,
        path: `/${name}`,
    }),
    get: (name: string = 'chats'): ApiRequest => ({
        ...groupedList._base(name),
        method: 'GET',
        apiVerb: 'get',
    }),
    add: (item: Json, name: string = 'chats'): ApiRequest => ({
        ...groupedList._base(name),
        method: 'POST',
        apiVerb: 'add',
        params: {
            item,
        },
    }),
    patch: (doc: string, change: Json, name: string = 'chats'): ApiRequest => ({
        ...groupedList._base(name),
        method: 'PATCH',
        apiVerb: 'patch',
        path: `/${name}/${doc}`,
        params: {
            change,
        },
    }),
    delete: (doc: string, name: string = 'chats'): ApiRequest => ({
        ...groupedList._base(name),
        method: 'DELETE',
        apiVerb: 'delete',
        path: `/${name}/${doc}`,
    }),
    clear: (name: string = 'chats'): ApiRequest => ({
        ...groupedList._base(name),
        method: 'DELETE',
        apiVerb: 'clear',
        path: `/${name}`,
    }),
    getItems: (doc: string, name: string = 'chats'): ApiRequest => ({
        ...groupedList._base(name),
        method: 'GET',
        apiVerb: 'getItems',
        path: `/${name}/${doc}/items`,
    }),
    pushItem: (
        doc: string,
        item: Json,
        name: string = 'chats'
    ): ApiRequest => ({
        ...groupedList._base(name),
        method: 'POST',
        apiVerb: 'pushItem',
        path: `/${name}/${doc}/items`,
        params: {
            item,
        },
    }),
    popItem: (doc: string, name: string = 'chats'): ApiRequest => ({
        ...groupedList._base(name),
        method: 'DELETE',
        apiVerb: 'popItem',
        path: `/${name}/${doc}/items`,
    }),
    clearItems: (doc: string, name: string = 'chats'): ApiRequest => ({
        ...groupedList._base(name),
        method: 'DELETE',
        apiVerb: 'clearItems',
        path: `/${name}/${doc}/items`,
    }),
};
