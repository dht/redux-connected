import { StoreStructure } from 'redux-store-generator';
import { IAppState, IChats, ILogs, IProducts, IUser } from './types';

export interface MyStore extends StoreStructure {
    appState: IAppState;
    user: IUser;
    products: IProducts;
    logs: ILogs;
    chats: IChats;
}

export const initialState: MyStore = {
    appState: {
        isLoading: false,
    },
    user: {},
    products: {
        '3370bde9-11ca-4785-9056-e4f5308164a3': {
            id: '3370bde9-11ca-4785-9056-e4f5308164a3',
            title: 'Intelligent Steel Pizza',
            description: 'The beautiful range of Apple Naturalé that',
            dateAdded:
                'Thu Jun 03 2021 06:47:53 GMT+0300 (Israel Daylight Time)',
            price: 158,
            department: 'Garden',
            color: 'azure',
            thumbnail:
                'https://cdn.fakercloud.com/avatars/kijanmaharjan_128.jpg',
            imageUrl: 'http://placeimg.com/640/480',
            shippingDate:
                'Sat Aug 21 2021 15:12:41 GMT+0300 (Israel Daylight Time)',
        },
    },
    logs: [
        {
            id: 'f2157a92-2257-4435-bfcf-57d53349bee0',
            date: 'Wed Sep 16 2020 21:23:13 GMT+0300 (Israel Daylight Time)',
            priority: '94952',
        },
    ],
    chats: {
        '1': {
            id: '1',
            title: '',
            items: [],
        },
    },
};

export default initialState;
