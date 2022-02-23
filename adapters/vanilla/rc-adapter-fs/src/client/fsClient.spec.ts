import { FsClientDriver } from './fsClient.driver';
import {
    small,
    randomUser,
    randomLog,
    randomProduct,
    randomChat,
    randomChatMessage,
} from 'rc-adapter-base';
import * as path from 'path';
import { Mocks } from 'redux-connected-types';

const DB_PATH = path.resolve('./db.json');

describe('fsClient', () => {
    let driver, mocks: Partial<Mocks>;

    const current = {
        log: small.logs[0],
        logLast: small.logs[small.logs.length - 1],
        product: small.products[0],
        chat: small.chats[0],
        chatMessage: small.chatItems[0],
    };

    afterAll(() => {
        driver.cleanUp();
    });

    beforeEach(() => {
        mocks = {
            user: randomUser(),
            userPartial: { firstName: randomUser().firstName },
            log: randomLog(),
            logSet: { ...randomLog(), id: current.log!.id },
            logPartial: { date: randomLog().date },
            logs: [randomLog(), randomLog(), randomLog()],
            product: randomProduct(),
            productSet: { ...randomProduct(), id: current.product!.id },
            productPartial: { dateAdded: randomProduct().dateAdded },
            products: [randomProduct(), randomProduct(), randomProduct()],
            chat: randomChat(),
            chatSet: { ...randomChat(), id: current.chat!.id },
            chatPartial: { title: randomChat().title },
            chats: [randomChat(), randomChat(), randomChat()],
            chatMessage: randomChatMessage(current.chat.id),
            chatMessageSet: { ...randomChatMessage(current.chat.id), id: current.chatMessage!.id }, // prettier-ignore
            chatMessagePartial: { content: randomChatMessage(current.chat.id).content }, // prettier-ignore
            chatMessages: [randomChatMessage(current.chat.id), randomChatMessage(current.chat.id), randomChatMessage(current.chat.id)], // prettier-ignore
        };

        driver = new FsClientDriver(DB_PATH, small);
        driver.prepare();
    });

    describe('happy flow', () => {
        describe('single', () => {
            describe('/user', () => {
                it('get', () => { expect(driver.get.user()).toEqual(small.user) }); // prettier-ignore
                it('set', () => { expect(driver.when.userChange(mocks.user).get.user()).toEqual(mocks.user) }); // prettier-ignore
                it('patch', () => { expect(driver.when.userPatch(mocks.userPartial).get.user().firstName).toEqual(mocks.userPartial?.firstName) }); // prettier-ignore
                it('delete', () => { expect(driver.when.userDelete().get.user()).toEqual(undefined) }); // prettier-ignore
            });

            describe('/logs/:id', () => {
                it('get', () => { expect(driver.get.log(current.log.id)).toEqual(small.logs[0]) }); // prettier-ignore
                it('set', () => { expect(driver.when.logChange(mocks.logSet).get.log(mocks.logSet?.id)).toEqual(mocks.logSet) }); // prettier-ignore
                it('patch', () => { expect(driver.when.logPatch(current.log.id, mocks.logPartial).get.log(current.log.id).date).toEqual(mocks.logPartial?.date) }); // prettier-ignore
                it('delete', () => { expect(driver.when.logDelete(current.log.id).get.log(current.log.id)).toEqual(undefined) }); // prettier-ignore
            });

            describe('/products/:id', () => {
                it('get', () => { expect(driver.get.product(current.product.id)).toEqual(small.products[0]) }); // prettier-ignore
                it('set', () => { expect(driver.when.productChange(mocks.productSet).get.product(mocks.productSet?.id)).toEqual(mocks.productSet) }); // prettier-ignore
                it('patch', () => { expect(driver.when.productPatch(current.product.id, mocks.productPartial).get.product(current.product.id).dateAdded).toEqual(mocks.productPartial?.dateAdded) }); // prettier-ignore
                it('delete', () => { expect(driver.when.productDelete(current.product.id).get.product(current.product.id)).toEqual(undefined) }); // prettier-ignore
            });

            describe('/chats/:id', () => {
                it('get', () => { expect(driver.get.chat(current.chat.id)).toEqual(small.chats[0]) }); // prettier-ignore
                it('set', () => { expect(driver.when.chatChange(mocks.chatSet).get.chat(mocks.chatSet?.id)).toEqual(mocks.chatSet) }); // prettier-ignore
                it('patch', () => { expect(driver.when.chatPatch(current.chat.id, mocks.chatPartial).get.chat(current.chat.id).title).toEqual(mocks.chatPartial?.title) }); // prettier-ignore
                it('delete', () => { expect(driver.when.chatDelete(current.chat.id).get.chat(current.chat.id)).toEqual(undefined) }); // prettier-ignore
            });

            describe('/chats/:id/items/:itemId', () => {
                it('get', () => { expect(driver.get.chatMessage(current.chatMessage.chatId, current.chatMessage.id)).toEqual(small.chatItems[0]) }); // prettier-ignore
                it('set', () => { expect(driver.when.chatMessageChange(mocks.chatMessageSet).get.chatMessage(current.chatMessage.chatId, mocks.chatMessageSet?.id)).toEqual(mocks.chatMessageSet) }); // prettier-ignore
                it('patch', () => { expect(driver.when.chatMessagePatch(current.chatMessage.chatId, current.chatMessage.id, mocks.chatMessagePartial).get.chatMessage(current.chatMessage.chatId, current.chatMessage.id).content).toEqual(mocks.chatMessagePartial?.content) }); // prettier-ignore
                it('delete', () => { expect(driver.when.chatMessageDelete(current.chatMessage.chatId, current.chatMessage.id).get.chatMessage(current.chatMessage.chatId, current.chatMessage.id)).toEqual(undefined) }); // prettier-ignore
            });
        });

        describe('collection', () => {
            describe('/logs', () => {
                it('get', () => { expect(driver.get.logs()).toEqual(small.logs) }); // prettier-ignore
                it('set', () => { expect(driver.when.logsChange(mocks.logs).get.logs()).toEqual(mocks.logs) }); // prettier-ignore
                it('add', () => { expect(driver.when.logAdd(mocks.log).get.log(mocks.log?.id)).toEqual(mocks.log) }); // prettier-ignore
                it('pop*', () => { expect(driver.when.logPop().get.log(current.logLast.id)).toEqual(undefined) }); // prettier-ignore
            });

            describe('/products', () => {
                it('get', () => { expect(driver.get.products()).toEqual(small.products) }); // prettier-ignore
                it('set', () => { expect(driver.when.productsChange(mocks.products).get.products()).toEqual(mocks.products) }); // prettier-ignore
                it('add', () => { expect(driver.when.productAdd(mocks.product).get.product(mocks.product?.id)).toEqual(mocks.product) }); // prettier-ignore
                it('delete', () => { expect(driver.when.productDelete(current.product.id).get.product(current.product.id)).toEqual(undefined) }); // prettier-ignore
            });

            describe('/chats', () => {
                it('get', () => { expect(driver.get.chats()).toEqual(small.chats) }); // prettier-ignore
                it('set', () => { expect(driver.when.chatsChange(mocks.chats).get.chats()).toEqual(mocks.chats) }); // prettier-ignore
                it('add', () => { expect(driver.when.chatAdd(mocks.chat).get.chat(mocks.chat?.id)).toEqual(mocks.chat) }); // prettier-ignore
                it('delete', () => { expect(driver.when.chatDelete(current.chat.id).get.chat(current.chat.id)).toEqual(undefined) }); // prettier-ignore
            });

            describe('/chats/:id/items', () => {
                it('get', () => { expect(driver.get.chatMessages(current.chat.id)).toEqual(small.chatItems.filter(chat => chat.chatId === current.chat.id)) }); // prettier-ignore
                it('set', () => { expect(driver.when.productsChange(mocks.products).get.products()).toEqual(mocks.products) }); // prettier-ignore
                it('add', () => { expect(driver.when.productAdd(mocks.product).get.product(mocks.product?.id)).toEqual(mocks.product) }); // prettier-ignore
                it('pop*', () => { expect(driver.when.productDelete(current.product.id).get.product(current.product.id)).toEqual(undefined) }); // prettier-ignore
            });
        });
    });
});
