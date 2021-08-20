import { storeId } from '../store';

let DEBUG = false;

export const log = (message: string) => {
    if (!DEBUG) {
        return;
    }

    console.log(`${storeId}: ${message}`);
};

export const initLog = (debug?: boolean) => {
    DEBUG = debug === true;
};
