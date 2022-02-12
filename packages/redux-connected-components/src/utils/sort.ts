import { Item, SortOrder, SortOrders } from '../types/types';

export const sortItems = (items: Item[], sortOrder: SortOrders) => {
    const sortField = Object.keys(sortOrder)[0];
    if (sortField && sortOrder[sortField] !== SortOrder.NONE) {
        items.sort((a: any, b: any) => {
            const valueA = a[sortField];
            const valueB = b[sortField];
            if (valueA === valueB) return 0;
            const m = sortOrder[sortField] === SortOrder.ASCENDING ? 1 : -1;
            return valueA > valueB ? -m : m;
        });
    }
};

export const sortToQueryParams = (sortOrders: SortOrders) => {
    let output = {};

    const key = Object.keys(sortOrders).pop();

    if (!key) {
        return output;
    }

    switch (sortOrders[key]) {
        case SortOrder.ASCENDING:
            output = { _sort: key, _order: 'asc' };
            break;
        case SortOrder.DESCENDING:
            output = { _sort: key, _order: 'desc' };
            break;
        case SortOrder.NONE:
            output = {};
            break;
    }

    return output;
};
