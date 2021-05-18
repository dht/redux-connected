import { myStoreState } from '../__fixtures__/store-state';

const globals = {
    mainStore: null,
    connectedStore: null,
    structure: myStoreState,
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
};

export default {
    ...accessors,
};
//
