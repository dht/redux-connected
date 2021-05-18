/**
 * @jest-environment jsdom
 */
import { generateConnectedStore, generateStore } from './../store';
import { renderHook, act } from '@testing-library/react-hooks';
import globals from '../globals';
import { useMonitor } from './useMonitor';

jest.mock('../globals');
jest.mock('../sagas/_utils/date');
jest.mock('../sagas/_utils/uuid');

describe('useMonitor', () => {
    let store: any, state: any, action: any;

    beforeEach(() => {
        globals.connectedStore = generateConnectedStore(globals.structure);
        store = globals.connectedStore;
        state = store.getState();
    });

    it('should listen to actions', () => {
        const { result } = renderHook(() => useMonitor({ monitorState: true }));

        action = {
            type: 'PATCH_PRODUCT',
            payload: { id: 1, title: '' },
        };

        act(() => {
            globals.connectedStore.dispatch(action);
        });

        const actionWithMeta = {
            action,
            meta: {
                createdTS: 100,
                id: '00000000-0000-0000-0000-000000000000',
                sequence: 1,
                shortId: '0000',
            },
        };

        state._lastAction = action;

        const [readings] = result.current;
        expect(readings).toEqual([{ ...actionWithMeta, state }]);
    });

    it('should listen to actions onlyLast true', () => {
        const { result } = renderHook(() => useMonitor({ onlyLast: true }));

        action = {
            type: 'PATCH_PRODUCT',
            payload: { id: 1, title: '' },
        };

        act(() => {
            globals.connectedStore.dispatch(action);
            globals.connectedStore.dispatch(action);
        });

        const [readings] = result.current;
        expect(readings.length).toEqual(1);
    });

    it('should listen to actions onlyLast true', () => {
        const { result } = renderHook(() => useMonitor({ onlyLast: false }));

        action = {
            type: 'PATCH_PRODUCT',
            payload: { id: 1, title: '' },
        };

        act(() => {
            globals.connectedStore.dispatch(action);
            globals.connectedStore.dispatch(action);
        });

        const [readings] = result.current;
        expect(readings.length).toEqual(2);
    });

    it('should listen to actions onlyLast defaults to false', () => {
        const { result } = renderHook(() => useMonitor());

        action = {
            type: 'PATCH_PRODUCT',
            payload: { id: 1, title: '' },
        };

        act(() => {
            globals.connectedStore.dispatch(action);
            globals.connectedStore.dispatch(action);
        });

        const [readings] = result.current;
        expect(readings.length).toEqual(2);
    });
});
