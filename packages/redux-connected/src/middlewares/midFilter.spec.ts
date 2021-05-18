import { partialStore } from './../__fixtures__/store-state';
import { filterMiddleware } from './midFilter';
import globals from '../globals';

jest.mock('../globals');
jest.mock('../sagas/_utils/dispatchP');

const mockStore = (state?: any) => ({
    dispatch: jest.fn(),
    getState: () => state,
});

describe('midConnected', () => {
    let store: any, next: any, action: any, resolve: any;

    beforeEach(() => {
        globals.mainStore = mockStore();
        globals.connectedStore = mockStore(partialStore);
        store = globals.mainStore;
        next = jest.fn();
        resolve = jest.fn();
    });

    it('should pass action', () => {
        action = { type: 'PATCH_PRODUCT' };
        filterMiddleware(globals.connectedStore)(next)(action);
        expect(next).toHaveBeenCalledWith(action);
    });

    it('should skip foreign action', () => {
        action = {
            type: 'FOREIGN',
            '@@redux-connected/ACTION_ID': true,
            resolve,
        };
        filterMiddleware(globals.connectedStore)(next)(action);
        expect(next).not.toHaveBeenCalled();
        delete action['resolve'];
        expect(resolve).toHaveBeenCalledWith({ nextAction: action });
    });

    it('should skip non-REST', () => {
        action = {
            type: 'PATCH_APPSTATE',
            '@@redux-connected/ACTION_ID': true,
            resolve,
        };
        filterMiddleware(globals.connectedStore)(next)(action);
        expect(next).not.toHaveBeenCalled();
        delete action['resolve'];
        expect(resolve).toHaveBeenCalledWith({ nextAction: action });
    });

    it('should skip isLocal', () => {
        action = {
            type: 'SET_LOG',
            '@@redux-connected/ACTION_ID': true,
            resolve,
        };
        filterMiddleware(globals.connectedStore)(next)(action);
        expect(next).not.toHaveBeenCalled();
        delete action['resolve'];
        expect(resolve).toHaveBeenCalledWith({ nextAction: action });
    });
});
