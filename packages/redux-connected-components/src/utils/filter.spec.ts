import { filterValueToQueryParams } from './../../src/utils/filter';
import { buildFilterValue } from '../../fixtures/fixtures.filters';

jest.mock('./../../src/utils/date');

describe('filter', () => {
    it('FilterType.VALUE', () => {
        const filterValue = buildFilterValue('value', [0]);
        expect(filterValueToQueryParams(filterValue)).toEqual({
            color: ['brown'],
        });
    });

    it('FilterType.VALUE multiple', () => {
        const filterValue = buildFilterValue('value', [0, 1]);
        expect(filterValueToQueryParams(filterValue)).toEqual({
            color: ['brown', 'green'],
        });
    });

    it('FilterType.RANGE', () => {
        const filterValue = buildFilterValue('range', [0]);
        expect(filterValueToQueryParams(filterValue)).toEqual({
            price_gte: '0',
            price_lte: '25',
        });
    });

    it('FilterType.RANGE with +', () => {
        const filterValue = buildFilterValue('range', [1]);
        expect(filterValueToQueryParams(filterValue)).toEqual({
            price_gte: '200',
        });
    });

    it('FilterType.RANGE with -', () => {
        const filterValue = buildFilterValue('range', [2]);
        expect(filterValueToQueryParams(filterValue)).toEqual({
            price_lte: '200',
        });
    });

    it('FilterType.DATE_RANGE with +', () => {
        const filterValue = buildFilterValue('date', [0]);
        expect(filterValueToQueryParams(filterValue)).toEqual({
            shippingDate_gte: '2021-12-12',
            shippingDate_lte: '2021-12-19',
        });
    });

    it('FilterType.DATE_RANGE with -', () => {
        const filterValue = buildFilterValue('date', [1]);
        expect(filterValueToQueryParams(filterValue)).toEqual({
            shippingDate_gte: '2021-11-12',
            shippingDate_lte: '2021-12-12',
        });
    });

    it('FilterType.DATE_RANGE with both + and -', () => {
        const filterValue = buildFilterValue('date', [2]);
        expect(filterValueToQueryParams(filterValue)).toEqual({
            shippingDate_gte: '2021-12-05',
            shippingDate_lte: '2021-12-19',
        });
    });

    it('FilterType.DATE_RANGE (today)', () => {
        const filterValue = buildFilterValue('date', [3]);
        expect(filterValueToQueryParams(filterValue)).toEqual({
            shippingDate_gte: '2021-12-12',
            shippingDate_lte: '2021-12-12',
        });
    });

    it('FilterType.DATE_RANGE (this week)', () => {
        const filterValue = buildFilterValue('date', [4]);
        expect(filterValueToQueryParams(filterValue)).toEqual({
            shippingDate_gte: '2021-12-12',
            shippingDate_lte: '2021-12-18',
        });
    });

    it('FilterType.DATE_RANGE (this month)', () => {
        const filterValue = buildFilterValue('date', [5]);
        expect(filterValueToQueryParams(filterValue)).toEqual({
            shippingDate_gte: '2021-12-01',
            shippingDate_lte: '2021-12-31',
        });
    });

    it('FilterType.DATE_RANGE (this year)', () => {
        const filterValue = buildFilterValue('date', [6]);
        expect(filterValueToQueryParams(filterValue)).toEqual({
            shippingDate_gte: '2021-01-01',
            shippingDate_lte: '2021-12-31',
        });
    });
});
