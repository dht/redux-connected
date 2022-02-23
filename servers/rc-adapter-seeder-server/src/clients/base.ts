export type Json = Record<string, any>;

export type NodeType =
    | 'single'
    | 'queue'
    | 'collection'
    | 'groupedList'
    | 'groupedListItems'
    | 'unknown';

const rootTypes: Record<string, NodeType> = {
    user: 'single',
    logs: 'queue',
    products: 'collection',
    chats: 'groupedList',
    chatItems: 'groupedListItems',
};

export class API {
    constructor(protected json: Json) {}

    scaffold() {}

    seed() {}

    getMany() {}

    getSingle() {}

    updateSingle() {}

    updateMany() {}

    getWithSort() {}

    getWithPagination() {}

    deleteSingle() {}

    deleteMany() {}

    getWithSingleFilter() {}

    getWithMultipleFilters() {}

    identifyRootNode(nodeName: string): NodeType {
        return rootTypes[nodeName] || 'unknown';
    }
}
