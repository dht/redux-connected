import { RealtimeDbClient } from './realtimeDbClient';
import {
    MockUser,
    MockProduct,
    MockChat,
    MockLog,
    MockChatMessage,
    Json,
} from 'redux-connected-types';
import axios from 'axios';
import { resetServer } from './helpers/reset-json-server';
import { BaseClientDriver } from 'rc-adapter-base';
import { mockStoreStructure } from 'rc-adapter-base/src/index.tests';

export class RealtimeDbClientDriver extends BaseClientDriver {
    client: RealtimeDbClient;

    constructor(private data: Json) {
        super();

        const instance = axios.create({
            baseURL: 'http://localhost:4756',
        });

        this.client = new RealtimeDbClient({
            axiosInstance: instance,
            structure: mockStoreStructure,
        });

        this.init();
    }

    async prepare() {
        await resetServer(this.data);
    }

    given: any = {};

    when: any = {
        userChange: (user: MockUser) => {
            return this.client.set('/user', user);
        },
        userPatch: (userPartial: Partial<MockUser>) => {
            return this.client.patch('/user', userPartial);
        },
        userDelete: () => {
            return this.client.delete('/user');
        },
        logChange: (log: MockLog) => {
            return this.client.set(`/logs/${log.id}`, log);
        },
        logPatch: (logId: string, logPartial: Partial<MockLog>) => {
            return this.client.patch(`/logs/${logId}`, logPartial);
        },
        logDelete: (logId: string) => {
            return this.client.delete(`/logs/${logId}`);
        },
        logsChange: (logs: MockLog[]) => {
            return this.client.set('/logs', logs);
        },
        logAdd: (log: MockLog) => {
            return this.client.add('/logs', log);
        },
        logPop: async () => {
            return this.client.pop('/logs');
        },
        productChange: (product: MockProduct) => {
            return this.client.set(`/products/${product.id}`, product);
        },
        productPatch: (
            productId: string,
            productPartial: Partial<MockProduct>
        ) => {
            return this.client.patch(`/products/${productId}`, productPartial);
        },
        productAdd: (product: MockProduct) => {
            return this.client.add('/products', product);
        },
        productDelete: (productId: string) => {
            return this.client.delete(`/products/${productId}`);
        },
        productsChange: (products: MockProduct[]) => {
            return this.client.set('/products', products);
        },
        chatChange: (chat: MockChat) => {
            return this.client.set(`/chats/${chat.id}`, chat);
        },
        chatPatch: (chatId: string, chatPartial: Partial<MockChat>) => {
            return this.client.patch(`/chats/${chatId}`, chatPartial);
        },
        chatDelete: (chatId: string) => {
            return this.client.delete(`/chats/${chatId}`);
        },
        chatsChange: (chats: MockChat[]) => {
            return this.client.set('/chats', chats);
        },
        chatAdd: (chat: MockChat) => {
            return this.client.add('/chats', chat);
        },
        chatMessageChange: (chatMessage: MockChatMessage) => {
            return this.client.set(
                `/chats/${chatMessage.chatId}/items/${chatMessage.id}`,
                chatMessage
            );
        },
        chatMessagePatch: (
            chatId: string,
            chatMessageId: string,
            chatMessagePartial: Partial<MockChatMessage>
        ) => {
            return this.client.patch(
                `/chats/${chatId}/items/${chatMessageId}`,
                chatMessagePartial
            );
        },
        chatMessageDelete: (chatId: string, chatMessageId: string) => {
            return this.client.delete(
                `/chats/${chatId}/items/${chatMessageId}`
            );
        },
        chatMessagesChange: (
            chatId: string,
            chatMessages: MockChatMessage[]
        ) => {
            return this.client.set(`/chats/${chatId}/items`, chatMessages);
        },
    };

    get: any = {
        user: (): Promise<string> => {
            return this.client.get('/user');
        },
        log: (logId: string): Promise<MockLog> => {
            return this.client.get(`/logs/${logId}`);
        },
        logs: (): Promise<MockLog[]> => {
            return this.client.get('/logs', {
                orderBy: {
                    field: 'id',
                },
            });
        },
        product: (productId: string): Promise<MockProduct> => {
            return this.client.get(`/products/${productId}`);
        },
        products: (): Promise<MockProduct[]> => {
            return this.client.get('/products', {
                orderBy: {
                    field: 'price',
                },
            });
        },
        chat: (chatId: string): Promise<MockChat> => {
            return this.client.get(`/chats/${chatId}`);
        },
        chats: (): Promise<MockChat[]> => {
            return this.client.get('/chats', {
                orderBy: {
                    field: 'id',
                },
            });
        },
        chatMessage: (
            chatId: string,
            chatMessageId: string
        ): Promise<MockChatMessage> => {
            return this.client.get(`/chats/${chatId}/items/${chatMessageId}`);
        },
        chatMessages: (chatId: string): Promise<MockChatMessage[]> => {
            return this.client.get(`/chats/${chatId}/items`, {
                orderBy: {
                    field: 'timestamp',
                },
            });
        },
    };
}
