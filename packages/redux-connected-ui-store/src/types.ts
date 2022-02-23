export type IAppState = { isLoading: boolean; email?: string };
export type IUser = { userName?: string; email?: string };
export type IProduct = {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
    description: string;
    department: string;
    imageUrl: string;
    color: string;
    dateAdded: string;
    shippingDate: string;
};
export type IProducts = Record<string, IProduct>;

export type ILog = {
    id: string;
    date: string;
    priority: string;
};

export type ILogs = Array<ILog>;

export type IMessage = { id: string; timestamp: number; content: string; isMe: boolean }; // prettier-ignore
export type IChat = { id: string; title: string; items: IMessage[] };
export type IChats = Record<string, IChat>;
//
