import { IReduxConnectedConfig } from '../types';

const globals: any = {
    mainStore: null,
    connectedStore: null,
    structure: null,
    adapters: null,
    config: null,
} as {
    mainStore: any;
    connectedStore: any;
    structure: any;
    adapters: any;
    config: IReduxConnectedConfig | null;
};

const accessors = {
    set mainStore(store: any) {
        globals.mainStore = store;
    },
    get mainStore() {
        return globals.mainStore;
    },
    set connectedStore(store: any) {
        globals.connectedStore = store;
    },
    get connectedStore() {
        return globals.connectedStore;
    },
    set structure(structure: any) {
        globals.structure = structure;
    },
    get structure() {
        return globals.structure;
    },
    set adapters(adapters: any) {
        globals.adapters = adapters;
    },
    get adapters() {
        return globals.adapters;
    },
    set config(value: any) {
        globals.config = value;
    },
    get config() {
        return globals.config;
    },
};

export default accessors;
