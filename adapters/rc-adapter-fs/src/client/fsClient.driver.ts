import { FsClient } from './fsClient';
import * as fs from 'fs-extra';
import {
    MockUser,
    Json,
    MockProduct,
    MockChat,
    MockChatMessage,
    MockLog,
} from 'redux-connected-types';

export class FsClientDriver {
    client: FsClient;

    constructor(private dbPath: string, private data: Json) {
        this.prepare();
        this.client = new FsClient({
            dbPath,
            fs,
        });
    }

    prepare() {
        fs.writeJsonSync(this.dbPath, this.data, { spaces: 4 });
    }

    cleanUp() {
        fs.unlinkSync(this.dbPath);
    }

    given: any = {};

    when: any = {
        userChange: (user: MockUser) => {
            this.client.set('/user', user);
            return this;
        },
        userPatch: (userPartial: Partial<MockUser>) => {
            this.client.patch('/user', userPartial);
            return this;
        },
        userDelete: () => {
            this.client.delete('/user');
            return this;
        },
        logChange: (log: MockLog) => {
            this.client.set(`/logs/${log.id}`, log);
            return this;
        },
        logPatch: (logId: string, logPartial: Partial<MockLog>) => {
            this.client.patch(`/logs/${logId}`, logPartial);
            return this;
        },
        logDelete: (logId: string) => {
            this.client.delete(`/logs/${logId}`);
            return this;
        },
        logsChange: (logs: MockLog[]) => {
            this.client.set('/logs', logs);
            return this;
        },
        logAdd: (log: MockLog) => {
            this.client.add('/logs', log);
            return this;
        },
        logPop: () => {
            this.client.pop('/logs');
            return this;
        },
        productChange: (product: MockProduct) => {
            this.client.set(`/products/${product.id}`, product);
            return this;
        },
        productPatch: (
            productId: string,
            productPartial: Partial<MockProduct>
        ) => {
            this.client.patch(`/products/${productId}`, productPartial);
            return this;
        },
        productAdd: (product: MockProduct) => {
            this.client.add('/products', product);
            return this;
        },
        productDelete: (productId: string) => {
            this.client.delete(`/products/${productId}`);
            return this;
        },
        productsChange: (products: MockProduct[]) => {
            this.client.set('/products', products);
            return this;
        },
        chatChange: (chat: MockChat) => {
            this.client.set(`/chats/${chat.id}`, chat);
            return this;
        },
        chatPatch: (chatId: string, chatPartial: Partial<MockChat>) => {
            this.client.patch(`/chats/${chatId}`, chatPartial);
            return this;
        },
        chatDelete: (chatId: string) => {
            this.client.delete(`/chats/${chatId}`);
            return this;
        },
        chatsChange: (chats: MockChat[]) => {
            this.client.set('/chats', chats);
            return this;
        },
        chatAdd: (chat: MockChat) => {
            this.client.add('/chats', chat);
            return this;
        },
        chatMessageChange: (chatMessage: MockChatMessage) => {
            this.client.set(
                `/chats/${chatMessage.chatId}/items/${chatMessage.id}`,
                chatMessage
            );
            return this;
        },
        chatMessagePatch: (
            chatId: string,
            chatMessageId: string,
            chatMessagePartial: Partial<MockChatMessage>
        ) => {
            this.client.patch(
                `/chats/${chatId}/items/${chatMessageId}`,
                chatMessagePartial
            );
            return this;
        },
        chatMessageDelete: (chatId: string, chatMessageId: string) => {
            this.client.delete(`/chats/${chatId}/items/${chatMessageId}`);
            return this;
        },
        chatMessagesChange: (
            chatId: string,
            chatMessages: MockChatMessage[]
        ) => {
            this.client.set(`/chats/${chatId}/items`, chatMessages);
            return this;
        },
    };

    get: any = {
        user: (): string => {
            this.client.reloadDataFromDisk();
            return this.client.get('/user');
        },
        log: (logId: string): MockLog => {
            this.client.reloadDataFromDisk();
            return this.client.get(`/logs/${logId}`);
        },
        logs: (): MockLog[] => {
            this.client.reloadDataFromDisk();
            return this.client.get('/logs');
        },
        product: (productId: string): MockProduct => {
            this.client.reloadDataFromDisk();
            return this.client.get(`/products/${productId}`);
        },
        products: (): MockProduct[] => {
            this.client.reloadDataFromDisk();
            return this.client.get('/products');
        },
        chat: (chatId: string): MockChat => {
            this.client.reloadDataFromDisk();
            return this.client.get(`/chats/${chatId}`);
        },
        chats: (): MockChat[] => {
            this.client.reloadDataFromDisk();
            return this.client.get('/chats');
        },
        chatMessage: (
            chatId: string,
            chatMessageId: string
        ): MockChatMessage => {
            this.client.reloadDataFromDisk();
            return this.client.get(`/chats/${chatId}/items/${chatMessageId}`);
        },
        chatMessages: (chatId: string): MockChatMessage[] => {
            this.client.reloadDataFromDisk();
            return this.client.get(`/chats/${chatId}/items`);
        },
    };
}
