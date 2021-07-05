import { Item } from 'redux-store-generator';

export const itemsToObject = (items: Item[]) => {
    return items.reduce((output, item) => {
        output[item.id] = item;
        return output;
    }, {} as any);
};
