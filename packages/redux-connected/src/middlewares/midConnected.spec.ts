import { generateConnectedStore, generateStore } from './../store';
import { connectedMiddleware } from './midConnected';
import globals from '../globals';

jest.mock('../sagas/_utils/dispatchP');

const mockStore = () => ({
    dispatch: jest.fn(),
});

describe('midConnected', () => {
    let store: any, next: any, action: any;

    beforeEach(() => {
        globals.mainStore = mockStore();
        globals.connectedStore = mockStore();
        store = globals.mainStore;
        next = jest.fn();
    });

    it('should call dispatchP, next and return API response', async () => {
        action = { type: 'PATCH_PRODUCT' };
        const response = await connectedMiddleware(globals.connectedStore)(
            next
        )(action);
        expect(next).toHaveBeenCalledWith({ type: 'NEXT_ACTION' });
        expect(response).toEqual({ data: {} });
    });
});
