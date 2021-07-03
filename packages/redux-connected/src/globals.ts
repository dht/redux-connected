const globals = {
    mainStore: null,
    connectedStore: null,
    structure: null,
    adapters: null,
};

const accessors = {
    set mainStore(store: any) {
        console.log('store1 set ->', store);
        globals.mainStore = store;
    },
    get mainStore() {
        console.log('store1 get ->', globals.mainStore);
        return globals.mainStore;
    },
    set connectedStore(store: any) {
        console.log('store2 set ->', store);
        globals.connectedStore = store;
    },
    get connectedStore() {
        console.log('store2 get ->', globals.connectedStore);
        return globals.connectedStore;
    },
    set structure(structure: any) {
        globals.structure = structure;
    },
    get structure() {
        return globals.structure;
    },
    set adapters(adapters: any) {
        globals.structure = adapters;
    },
    get adapters() {
        return globals.adapters;
    },
};

export default {
    ...accessors,
};
//
