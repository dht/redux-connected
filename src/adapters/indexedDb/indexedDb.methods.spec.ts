import { cloneDeep } from 'shared-base';
import { allData } from './indexedDb.methods.fixtures';
import {
    getXPath,
    setXPath,
    patchXPath,
    deleteXPath,
    getByPredicate,
    deleteByPredicate,
    initStorage,
    KEY,
} from './indexedDb.methods';
import Chance from 'chance';

const chance = new Chance();

describe('indexedDb.methods', () => {
    let fn;

    beforeEach(() => {
        fn = jest.fn();

        initStorage({
            getJson: (_key: string) => cloneDeep(allData),
            setJson: fn,
        });
    });

    describe('getXPath', () => {
        it('single', () => {
            expect(
                getXPath({
                    key: 'singles',
                    xpath: 'appState',
                })
            ).toEqual(allData.singles.appState);
        });

        it('collection', () => {
            expect(
                getXPath({
                    key: 'chats',
                })
            ).toEqual(allData.chats);
        });

        it('collection item', () => {
            expect(
                getXPath({
                    key: 'chats',
                    xpath: '1',
                })
            ).toEqual(allData.chats['1']);
        });
    });

    describe('setXPath', () => {
        it('single', () => {
            const value = { a: chance.integer() };

            setXPath(
                {
                    key: 'singles',
                    xpath: 'appState',
                },
                value
            );

            expect(fn).toHaveBeenCalledWith(KEY, {
                ...allData,
                singles: {
                    appState: value,
                    currentIds: { chatId: '1' },
                },
            });
        });

        it('collection', () => {
            const value = { a: chance.integer() };

            setXPath(
                {
                    key: 'chats',
                    xpath: '1',
                },
                value
            );

            expect(fn).toHaveBeenCalledWith(KEY, {
                ...allData,
                chats: {
                    '1': value,
                    '2': { id: '2', name: 'chat 2' },
                },
            });
        });

        it('collection item', () => {
            const value = { a: chance.integer() };

            setXPath(
                {
                    key: 'chatsItems',
                    xpath: '1',
                },
                value
            );

            expect(fn).toHaveBeenCalledWith(KEY, {
                ...allData,
                chatsItems: {
                    '1': value,
                    '2': {
                        id: '2',
                        name: 'message 2',
                        parentId: '1',
                    },
                    '3': {
                        id: '3',
                        name: 'message 1',
                        parentId: '2',
                    },
                },
            });
        });
    });

    describe('patchXPath', () => {
        it('single', () => {
            const value = { a: chance.integer() };

            patchXPath(
                {
                    key: 'singles',
                    xpath: 'appState',
                },
                value
            );

            expect(fn).toHaveBeenCalledWith(KEY, {
                ...allData,
                singles: {
                    appState: {
                        isLoading: true,
                        isLoggedIn: false,
                        ...value,
                    },
                    currentIds: { chatId: '1' },
                },
            });
        });

        it('collection', () => {
            const value = { a: chance.integer() };

            patchXPath(
                {
                    key: 'chats',
                    xpath: '1',
                },
                value
            );

            expect(fn).toHaveBeenCalledWith(KEY, {
                ...allData,
                chats: {
                    ...allData.chats,
                    '1': {
                        ...allData.chats['1'],
                        ...value,
                    },
                },
            });
        });

        it('collection item', () => {
            const value = { a: chance.integer() };

            patchXPath(
                {
                    key: 'chatsItems',
                    xpath: '1',
                },
                value
            );

            expect(fn).toHaveBeenCalledWith(KEY, {
                ...allData,
                chatsItems: {
                    ...allData.chatsItems,
                    '1': {
                        ...allData.chatsItems['1'],
                        ...value,
                    },
                },
            });
        });
    });

    describe('deleteXPath', () => {
        it('single', () => {
            deleteXPath({
                key: 'singles',
                xpath: 'appState',
            });

            expect(fn).toHaveBeenCalledWith(KEY, {
                ...allData,
                singles: {
                    currentIds: { chatId: '1' },
                },
            });
        });

        it('collection', () => {
            deleteXPath({
                key: 'chats',
                xpath: '1',
            });

            expect(fn).toHaveBeenCalledWith(KEY, {
                ...allData,
                chats: {
                    '2': { id: '2', name: 'chat 2' },
                },
            });
        });

        it('collection item', () => {
            deleteXPath({
                key: 'chatsItems',
                xpath: '1',
            });

            expect(fn).toHaveBeenCalledWith(KEY, {
                ...allData,
                chatsItems: {
                    '2': {
                        id: '2',
                        name: 'message 2',
                        parentId: '1',
                    },
                    '3': {
                        id: '3',
                        name: 'message 1',
                        parentId: '2',
                    },
                },
            });
        });
    });

    describe('getByPredicate', () => {
        it('collection', () => {
            expect(getByPredicate('chats', (item) => item.id === '1')).toEqual([
                allData.chats['1'],
            ]);
        });

        it('collection item', () => {
            expect(
                getByPredicate('chatsItems', (item) => item.parentId === '1')
            ).toEqual([
                allData.chatsItems['1'], //
                allData.chatsItems['2'],
            ]);
        });
    });

    describe('deleteByPredicate', () => {
        it('collection', () => {
            deleteByPredicate('chats', (item) => item.id === '1');

            expect(fn).toHaveBeenCalledWith(KEY, {
                ...allData,
                chats: {
                    '2': { id: '2', name: 'chat 2' },
                },
            });
        });

        it('collection item', () => {
            deleteByPredicate('chatsItems', (item) => item.parentId === '1');

            expect(fn).toHaveBeenCalledWith(KEY, {
                ...allData,
                chatsItems: {
                    '3': {
                        id: '3',
                        name: 'message 1',
                        parentId: '2',
                    },
                },
            });
        });
    });
});
