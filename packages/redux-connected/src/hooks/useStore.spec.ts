/**
 * @jest-environment jsdom
 */
import { generateConnectedStore } from '../store';
import { renderHook, act } from '@testing-library/react-hooks';
import globals from '../globals';
import { useStore } from './useStore';

jest.mock('../globals');

describe('useStore', () => {
    let store: any, state: any, action: any, callback: any;

    beforeEach(() => {
        globals.connectedStore = generateConnectedStore(globals.structure);
        store = globals.connectedStore;
        state = store.getState();
        callback = jest.fn();
    });

    it('should listen to actions', () => {
        renderHook(() => useStore(callback));

        action = {
            type: 'PATCH_PRODUCT',
            payload: { id: 1, title: '' },
        };

        globals.connectedStore.dispatch(action);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith({
            action,
            state: {
                ...state,
                _lastAction: action,
            },
        });
    });

    it('should listen to actions with predicate', () => {
        renderHook(() =>
            useStore(callback, (action) => action.type === 'GOOD')
        );

        action = {
            type: 'GOOD',
            payload: { id: 1, title: '' },
        };

        const ignoredAction = {
            type: 'IGNORE',
            payload: { id: 1, title: '' },
        };

        globals.connectedStore.dispatch(action);
        globals.connectedStore.dispatch(ignoredAction);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith({
            action,
            state: {
                ...state,
                _lastAction: action,
            },
        });
    });
});
