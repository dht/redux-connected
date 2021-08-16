import { generateSingle } from 'redux-store-generator';
import { generateConnectedStore, generateStore } from './src/store';
import { myStoreState } from './src/mocks/store-state';
import { generateActionsForStore } from './dist';

const store = generateStore(myStoreState, {});
const connectedStore = generateConnectedStore(myStoreState);

const actions = generateActionsForStore(myStoreState);

const run = async () => {
    await delay(3000);
    store.dispatch(actions.user.get());
};

const delay = (duration: number) =>
    new Promise((resolve) => setTimeout(resolve, duration));

run();
