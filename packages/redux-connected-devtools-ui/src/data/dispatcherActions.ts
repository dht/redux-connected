export type ActionParams = Record<string, any[]>;

export const SINGLE_NODE: ActionParams = {
    get: [{}],
    setAll: [{ title: 'TITLE' }],
    patch: [{ rnd: Math.random() }],
};

export const COLLECTION_NODE: ActionParams = {
    get: [{}],
    setAll: [{ p1: { id: 'p1', title: 'TITLE' } }],
    set: ['p2', { id: 'p2', title: 'TITLE' }],
    add: [{ title: 'TITLE' }],
    patch: ['p1', { title: 'SECOND_TITLE' }],
    delete: ['p1'],
};

export const QUEUE_NODE: ActionParams = {
    get: [],
    setAll: [{ '1': { id: '1', title: 'LOG' } }],
    push: [{ id: '2', title: 'LOG' }],
    pop: [],
    clear: [],
    pushMany: [{ '2': { id: '2', title: 'LOG' } }],
};

export const GROUPED_LIST_NODE: ActionParams = {
    get: [{}],
    setAll: [{ p1: { id: 'p1', title: 'TITLE' } }],
    set: ['p2', { id: 'p2', title: 'TITLE' }],
    add: [{ title: 'TITLE' }],
    patch: ['p1', { title: 'SECOND_TITLE' }],
    delete: ['p1'],

    getItems: ['p1'],
    setItems: ['p1', { '1': { id: '1', title: 'LOG' } }],
    pushItem: ['p1', { id: '2', title: 'LOG' }],
    popItem: ['p1'],
    clearItems: ['p1'],
    pushManyItems: ['p1', { '2': { id: '2', title: 'LOG' } }],
};
