import { ApiRequest } from '../types/types';
import {
    randomProduct,
    randomLog,
    dropIds,
    randomChat,
    randomChatMessage,
} from '../__helpers__/random';
import * as adapters from '../__helpers__/adapters';
import * as requests from '../__helpers__/apiRequests';
import Chance from 'chance';

const chance = new Chance();

describe('adapters', () => {
    [
        'firestore',
        'realtimeData',
        'jsonServer',
        'rest',
        'fs',
        'fsDirectories',
        'mySql',
        'sqlLite',
        'sockets',
    ]
        .filter((i) => i === 'fs')
        .forEach((w) => {
            describe(w, () => {
                let adapter, request, response;

                beforeAll(async () => {
                    console.log('w ->', w);
                    adapter = adapters[w];
                });

                describe('single', () => {
                    it('single: get', async () => {
                        request = requests.single.get();
                        response = await adapter.fireRequest(request);
                        console.log('response ->', response);

                        expect(typeof response.data.email).toEqual('string');
                    });

                    it('single: patch', async () => {
                        const email = chance.email();
                        request = requests.single.patch({ email });
                        response = await adapter.fireRequest(request);
                        expect(response.data).toEqual(true);
                    });
                });

                describe('queue', () => {
                    beforeAll(async () => {
                        const log = randomLog(null);
                        request = requests.queue.push(log, 'logsClear');
                        response = await adapter.fireRequest(request);
                    });

                    afterAll(async () => {
                        await clearCollections([
                            'logsClear',
                            'logsPush',
                            // 'logsPop',
                        ]);
                    });

                    it('queue: get', async () => {
                        request = requests.queue.get();
                        response = await adapter.fireRequest(request);
                        expect(response.data.length >= 1).toEqual(true);
                    });

                    it('queue: push', async () => {
                        const log = randomLog(null);

                        request = requests.queue.push(log, 'logsPush');
                        response = await adapter.fireRequest(request);
                        expect(response.data.title).toEqual(log.title);
                        request = requests.queue.get('logsPush');
                        response = await adapter.fireRequest(request);
                        expect(dropIds(response.data)).toContainEqual(log);
                    });

                    it('queue: clear', async () => {
                        request = requests.queue.clear('logsClear');
                        response = await adapter.fireRequest(request);

                        request = requests.queue.get('logsClear');
                        response = await adapter.fireRequest(request);
                        console.log('response ->', response);
                        expect(response.data.length === 0).toEqual(true);
                    });

                    it('queue: pop', async () => {
                        const log = randomLog(null, new Date().getTime());

                        // add the log
                        request = requests.queue.push(log, 'logsPop');
                        response = await adapter.fireRequest(request);

                        request = requests.queue.get('logsPop');
                        response = await adapter.fireRequest(request);

                        expect(dropIds(response.data)).toContainEqual(log); // log exists

                        // pop
                        request = requests.queue.pop('logsPop');
                        response = await adapter.fireRequest(request);

                        request = requests.queue.get('logsPop');
                        response = await adapter.fireRequest(request);
                        expect(dropIds(response.data)).not.toContainEqual(log); // log does NOT exist
                    });
                });

                describe('collection', () => {
                    beforeAll(async () => {
                        const product = randomProduct(null, 1);

                        request = requests.collection.add(product, 'productsClear'); // prettier-ignore
                        response = await adapter.fireRequest(request);

                        request = requests.collection.add(product, 'productsDelete'); // prettier-ignore
                        response = await adapter.fireRequest(request);

                        request = requests.collection.add(product, 'productsPatch'); // prettier-ignore
                        response = await adapter.fireRequest(request);
                    });

                    afterAll(async () => {
                        await clearCollections([
                            'productsAdd',
                            'productsClear',
                            'productsDelete',
                            'productsPatch',
                        ]);
                    });

                    it('collection: get', async () => {
                        request = requests.collection.get();
                        response = await adapter.fireRequest(request);
                        expect(response.data.length >= 1).toEqual(true);
                    });

                    it('collection: add', async () => {
                        const product = randomProduct(null, 1);

                        request = requests.collection.add(
                            product,
                            'productsAdd'
                        );
                        response = await adapter.fireRequest(request);

                        request = requests.collection.get('productsAdd');
                        response = await adapter.fireRequest(request);

                        expect(dropIds(response.data)).toContainEqual(product);
                    });

                    it('collection: clear', async () => {
                        request = requests.collection.clear('productsClear');
                        response = await adapter.fireRequest(request);

                        request = requests.collection.get('productsClear');
                        response = await adapter.fireRequest(request);
                        expect(response.data.length === 0).toEqual(true);
                    });

                    it('collection: patch', async () => {
                        const change = {
                            title: chance.word(),
                        };

                        const item = await getFirst(requests.collection.get('productsPatch')); // prettier-ignore

                        request = requests.collection.patch(item.id, change, 'productsPatch'); // prettier-ignore
                        response = await adapter.fireRequest(request);

                        request = requests.collection.get('productsPatch');
                        response = await adapter.fireRequest(request);

                        expect(response.data).toContainEqual({
                            ...item,
                            ...change,
                        });
                    });

                    it('collection: delete', async () => {
                        const item = await getFirst(requests.collection.get('productsDelete')); // prettier-ignore

                        request = requests.collection.delete(item.id, 'productsDelete'); // prettier-ignore
                        response = await adapter.fireRequest(request);

                        request = requests.collection.get('productsDelete');
                        response = await adapter.fireRequest(request);

                        expect(response.data).not.toContainEqual(item);
                    });
                });

                describe('groupedList', () => {
                    beforeAll(async () => {
                        //     const chat = randomChat(null);
                        //     request = requests.groupedList.add(chat, 'chatsClear');
                        //     response = await adapter.fireRequest(request);
                        //     request = requests.groupedList.add(chat, 'chatsDelete');
                        //     response = await adapter.fireRequest(request);
                        //     request = requests.groupedList.add(chat, 'chatsPatch');
                        //     response = await adapter.fireRequest(request);
                        //     request = requests.groupedList.add(chat, 'chatsPop');
                        //     response = await adapter.fireRequest(request);
                        //     request = requests.groupedList.add(chat, 'chatsItemsPush'); // prettier-ignore
                        //     response = await adapter.fireRequest(request);
                        //     request = requests.groupedList.add(chat, 'chatsItemsClear'); // prettier-ignore
                        //     response = await adapter.fireRequest(request);
                    });

                    afterAll(async () => {
                        // await clearCollections([
                        //     'chatsAdd',
                        //     'chatsClear',
                        //     'chatsDelete',
                        //     'chatsPatch',
                        //     'chatsPop',
                        //     'chatsItemsPush',
                        //     'chatsItemsClear',
                        // ]);
                    });

                    it('groupedList: get', async () => {
                        request = requests.groupedList.get();
                        response = await adapter.fireRequest(request);
                        expect(response.data.length >= 1).toEqual(true);
                    });

                    it('groupedList: add', async () => {
                        const chat = randomChat(null);

                        request = requests.groupedList.add(chat, 'chatsAdd');
                        response = await adapter.fireRequest(request);

                        request = requests.groupedList.get('chatsAdd');
                        response = await adapter.fireRequest(request);

                        expect(dropIds(response.data)).toContainEqual(chat);
                    });

                    it('groupedList: patch', async () => {
                        const change = {
                            title: chance.word(),
                        };

                        const item = await getFirst(requests.groupedList.get('chatsPatch')); // prettier-ignore

                        request = requests.groupedList.patch(item.id, change, 'chatsPatch'); // prettier-ignore
                        response = await adapter.fireRequest(request);

                        request = requests.groupedList.get('chatsPatch');
                        response = await adapter.fireRequest(request);

                        expect(response.data).toContainEqual({
                            ...item,
                            ...change,
                        });
                    });

                    it('groupedList: delete', async () => {
                        const item = await getFirst(requests.groupedList.get('chatsDelete')); // prettier-ignore

                        request = requests.groupedList.delete(item.id, 'chatsDelete'); // prettier-ignore
                        response = await adapter.fireRequest(request);

                        request = requests.groupedList.get('chatsDelete');
                        response = await adapter.fireRequest(request);

                        expect(response.data).not.toContainEqual(item);
                    });

                    it('groupedList: getItems', async () => {
                        // const item = await getFirst(requests.groupedList.get()); // prettier-ignore
                        // console.log('item.id ->', item.id);
                        const item = { id: '-MZ-i71WJqgvE18Y0ksS' };
                        request = requests.groupedList.getItems(item.id);
                        response = await adapter.fireRequest(request);
                        console.log('response ->', response);
                        expect(response.data.length >= 1).toEqual(true);
                    });

                    it('groupedList: pushItem', async () => {
                        let item = await getFirst(requests.groupedList.get('chatsItemsPush')); // prettier-ignore
                        const chatMessage = randomChatMessage(null);

                        request = requests.groupedList.pushItem(
                            item.id,
                            chatMessage,
                            'chatsItemsPush'
                        );
                        response = await adapter.fireRequest(request);

                        request = requests.groupedList.getItems(item.id, 'chatsItemsPush'); // prettier-ignore
                        response = await adapter.fireRequest(request);

                        item = response.data.find(
                            (i) => i.timestamp === chatMessage.timestamp
                        );

                        expect(item).not.toEqual(undefined);
                    });

                    it('groupedList: popItem', async () => {
                        let item = await getFirst(requests.groupedList.get('chatsPop')); // prettier-ignore
                        const chatMessage = randomChatMessage(null);

                        request = requests.groupedList.pushItem(
                            item.id,
                            chatMessage,
                            'chatsPop'
                        );

                        response = await adapter.fireRequest(request);

                        request = requests.groupedList.popItem(item.id,  'chatsPop'); // prettier-ignore
                        response = await adapter.fireRequest(request);

                        request = requests.groupedList.getItems(item.id, 'chatsPop'); // prettier-ignore
                        response = await adapter.fireRequest(request);

                        item = response.data.find(
                            (i) => i.timestamp === chatMessage.timestamp
                        );

                        expect(item).toEqual(undefined);
                    });

                    it('groupedList: clearItems', async () => {
                        let item = await getFirst(requests.groupedList.get('chatsItemsClear')); // prettier-ignore
                        const chatMessage = randomChatMessage(null);

                        request = requests.groupedList.pushItem(
                            item.id,
                            chatMessage,
                            'chatsItemsClear'
                        );
                        response = await adapter.fireRequest(request);

                        request = requests.groupedList.clearItems(item.id, 'chatsItemsClear'); // prettier-ignore
                        response = await adapter.fireRequest(request);

                        request = requests.groupedList.getItems(item.id, 'chatsItemsClear'); // prettier-ignore
                        response = await adapter.fireRequest(request);

                        expect(response.data.length == 0).toEqual(true);
                    });
                });

                describe('collection: query', () => {
                    it('collection: getQuery', async () => {
                        request = requests.collectionQuery.getQuery(
                            'title',
                            'Product #20'
                        );
                        response = await adapter.fireRequest(request);
                        expect(response.data.length).toEqual(89);
                    });

                    it('collection: getSort desc', async () => {
                        request = requests.collectionQuery.getSort(
                            'price',
                            'desc'
                        );
                        response = await adapter.fireRequest(request);
                        expect(response.data[0].price).toEqual(2000);
                    });

                    it('collection: getSort asc', async () => {
                        request = requests.collectionQuery.getSort(
                            'price',
                            'asc'
                        );
                        response = await adapter.fireRequest(request);
                        expect(response.data[0].price).toEqual(10);
                    });

                    it('collection: getLimit', async () => {
                        const limit = chance.integer({ min: 2, max: 10 });
                        request = requests.collectionQuery.getLimit(limit);
                        response = await adapter.fireRequest(request);
                        expect(response.data.length).toEqual(limit);
                    });

                    it('collection: getFilter', async () => {
                        request = requests.collectionQuery.getFilter(
                            'price',
                            '>=',
                            1000
                        );
                        response = await adapter.fireRequest(request);

                        const lowerThan1000exists = response.data
                            .map((i) => i.price)
                            .some((price) => price < 1000);

                        expect(lowerThan1000exists).toEqual(false);
                    });

                    it('collection: getPagination', async () => {
                        request = requests.collectionQuery.getPagination(false);
                        response = await adapter.fireRequest(request);

                        expect(response.data.length).toEqual(10);
                        expect(response.data[0].price).toEqual(2000);

                        request = requests.collectionQuery.getPagination(true);
                        response = await adapter.fireRequest(request);

                        expect(response.data.length).toEqual(10);
                        expect(response.data[0].price).toEqual(1910);
                    });
                });

                async function getFirst(request: ApiRequest) {
                    const response = await adapter.fireRequest(request);
                    const item = response.data[0];
                    return item;
                }

                async function clearCollections(arr: string[]) {
                    for (let name of arr) {
                        request = requests.queue.clear(name);
                        response = await adapter.fireRequest(request);
                    }
                }
            });
        });
});
