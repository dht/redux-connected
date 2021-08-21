export const itemsToObject = (items: any[]) => {
    return items.reduce((output, item) => {
        output[item.id] = item;
        return output;
    }, {} as any);
};
