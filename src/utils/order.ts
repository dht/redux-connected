export const orderBy = (fieldName: string) => (a: any, b: any) => {
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

export const toArray = <T = Json>(objectOrArray: T | T[]): T[] => {
    if (!objectOrArray) {
        return [];
    }
    return Array.isArray(objectOrArray) ? objectOrArray : [objectOrArray];
};

export const isEmpty = (object: Json | any[]) => {
    if (Array.isArray(object)) {
        return object.length === 0;
    }

    return Object.keys(object || {}).length === 0;
};

export const itemsToObject = (items: any[]) => {
    return items.reduce((output, item) => {
        output[item.id] = item;
        return output;
    }, {} as any);
};
