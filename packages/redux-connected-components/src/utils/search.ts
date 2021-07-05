import { Item } from '../types/types';

export const searchItems = (items: Item[], search: string = ''): Item[] => {
    return items.filter((item) => {
        return (
            !search ||
            search.length < 2 ||
            JSON.stringify(item).includes(search)
        );
    });
};

export const searchToQueryParams = (search: string) => {
    return {
        _search: search,
    };
};
