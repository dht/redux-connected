import { createSelector } from 'reselect';

export const $i = (i: any) => i;

export const $productsRaw = createSelector($i, (state: any) => state.products);

export const $products = createSelector($productsRaw, (products) => {
    return Object.values(products);
});
