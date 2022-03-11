import { Json } from '../../../../types';

export const orderBy = (fieldName: string) => (a, b) => {
    if (a[fieldName] === b[fieldName]) {
        return 0;
    }

    return a[fieldName] > b[fieldName] ? 1 : -1;
};

export const sortFixtures = (small: Json) => {
    small.logs.sort(orderBy('id'));
    small.products.sort(orderBy('price'));
    small.chats.sort(orderBy('id'));
    small.chatItems.sort(orderBy('timestamp'));
};
