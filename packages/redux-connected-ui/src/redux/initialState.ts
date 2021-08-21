import { StoreStructure } from '@redux-connected';

export type AppState = { isLoading: boolean; email?: string };
export type User = { userName?: string; email?: string };
export type Product = {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
    imageUrl: string;
    color: string;
    shippingDate: string;
};
export type Products = Record<string, Product>;
export type Log = { id: string };
export type Logs = Array<Log>;

export type Message = { id: string; timestamp: number; content: string; isMe: boolean }; // prettier-ignore
export type Chat = { id: string; title: string; items: Message[] };
export type Chats = Record<string, Chat>;

export interface MyStore extends StoreStructure {
    appState: AppState;
    user: User;
    products: Products;
    logs: Logs;
    chats: Chats;
}

export const state = {
    appState: {},
    user: {},
    products: {
        '1': {
            id: '1',
        },
    },
    logs: [],
    chats: {
        '1': {
            id: '1',
            items: [],
        },
    },
};

export default state;
