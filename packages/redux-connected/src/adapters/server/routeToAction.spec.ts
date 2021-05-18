import { NodeType } from 'redux-store-generator';
import { routeToAction } from './routeToAction';

describe('routeToAction', () => {
    let action;

    describe('SINGLE_NODE', () => {
        it('GET', () => {
            action = routeToAction('GET', '/appState', NodeType.SINGLE_NODE);

            expect(action).toEqual({
                nodeName: 'appState',
                verb: 'get',
            });
        });

        it('POST', () => {
            action = routeToAction('POST', '/appState', NodeType.SINGLE_NODE);

            expect(action).toEqual({
                nodeName: 'appState',
                verb: 'setAll',
            });
        });

        it('PATCH', () => {
            action = routeToAction('PATCH', '/appState', NodeType.SINGLE_NODE);

            expect(action).toEqual({
                nodeName: 'appState',
                verb: 'patch',
            });
        });
    });

    describe('QUEUE_NODE', () => {
        it('GET', () => {
            action = routeToAction('GET', '/logs', NodeType.QUEUE_NODE);

            expect(action).toEqual({
                nodeName: 'logs',
                verb: 'get',
            });
        });

        it('PUT', () => {
            action = routeToAction('PUT', '/logs', NodeType.QUEUE_NODE);

            expect(action).toEqual({
                nodeName: 'logs',
                verb: 'setAll',
            });
        });

        it('POST', () => {
            action = routeToAction('POST', '/logs', NodeType.QUEUE_NODE);

            expect(action).toEqual({
                nodeName: 'logs',
                verb: 'push',
            });
        });

        it('DELETE', () => {
            action = routeToAction('DELETE', '/logs', NodeType.QUEUE_NODE);

            expect(action).toEqual({
                nodeName: 'logs',
                verb: 'clear',
            });
        });
    });

    describe('COLLECTION_NODE', () => {
        it('GET', () => {
            action = routeToAction(
                'GET',
                '/products',
                NodeType.COLLECTION_NODE
            );

            expect(action).toEqual({
                nodeName: 'products',
                verb: 'get',
            });
        });

        it('PUT', () => {
            action = routeToAction(
                'PUT',
                '/products',
                NodeType.COLLECTION_NODE
            );

            expect(action).toEqual({
                nodeName: 'products',
                verb: 'setAll',
            });
        });

        it('POST', () => {
            action = routeToAction(
                'POST',
                '/products',
                NodeType.COLLECTION_NODE
            );

            expect(action).toEqual({
                nodeName: 'products',
                verb: 'add',
            });
        });

        it('PATCH', () => {
            action = routeToAction(
                'PATCH',
                '/products/10',
                NodeType.COLLECTION_NODE
            );

            expect(action).toEqual({
                nodeName: 'products',
                verb: 'patch',
                id: '10',
            });
        });

        it('DELETE', () => {
            action = routeToAction(
                'DELETE',
                '/products/10',
                NodeType.COLLECTION_NODE
            );

            expect(action).toEqual({
                nodeName: 'products',
                verb: 'delete',
                id: '10',
            });
        });
    });

    describe('GROUPED_LIST_NODE', () => {
        it('GET', () => {
            action = routeToAction('GET', '/chats', NodeType.GROUPED_LIST_NODE);

            expect(action).toEqual({
                nodeName: 'chats',
                verb: 'get',
            });
        });

        it('PUT', () => {
            action = routeToAction('PUT', '/chats', NodeType.GROUPED_LIST_NODE);

            expect(action).toEqual({
                nodeName: 'chats',
                verb: 'setAll',
            });
        });

        it('POST', () => {
            action = routeToAction(
                'POST',
                '/chats',
                NodeType.GROUPED_LIST_NODE
            );

            expect(action).toEqual({
                nodeName: 'chats',
                verb: 'add',
            });
        });

        it('PATCH', () => {
            action = routeToAction(
                'PATCH',
                '/chats/10',
                NodeType.GROUPED_LIST_NODE
            );

            expect(action).toEqual({
                nodeName: 'chats',
                verb: 'patch',
                id: '10',
            });
        });

        it('DELETE', () => {
            action = routeToAction(
                'DELETE',
                '/chats/10',
                NodeType.GROUPED_LIST_NODE
            );

            expect(action).toEqual({
                nodeName: 'chats',
                verb: 'delete',
                id: '10',
            });
        });

        it('items GET', () => {
            action = routeToAction(
                'GET',
                '/chats/10/items',
                NodeType.GROUPED_LIST_NODE
            );

            expect(action).toEqual({
                nodeName: 'chats',
                verb: 'getItems',
                id: '10',
            });
        });

        it('items PUT', () => {
            action = routeToAction(
                'PUT',
                '/chats/10/items',
                NodeType.GROUPED_LIST_NODE
            );

            expect(action).toEqual({
                nodeName: 'chats',
                verb: 'setItems',
                id: '10',
            });
        });

        it('items POST', () => {
            action = routeToAction(
                'POST',
                '/chats/10/items',
                NodeType.GROUPED_LIST_NODE
            );

            expect(action).toEqual({
                nodeName: 'chats',
                verb: 'pushItem',
                id: '10',
            });
        });

        it('items DELETE', () => {
            action = routeToAction(
                'DELETE',
                '/chats/10/items',
                NodeType.GROUPED_LIST_NODE
            );

            expect(action).toEqual({
                nodeName: 'chats',
                verb: 'clearItems',
                id: '10',
            });
        });
    });
});
