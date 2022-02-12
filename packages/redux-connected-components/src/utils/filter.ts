import {
    today,
    weekStart,
    weekEnd,
    monthStart,
    monthEnd,
    yearStart,
    yearEnd,
} from './date';
import {
    FilterType,
    FilterValue,
    FilterValues,
    Item,
    FilterOption,
} from '../types/types';
import { format, add } from 'date-fns';

type QueryParams = Record<string, string>;

export const filterItems = (
    items: Item[],
    currentFilters: FilterValues
): Item[] => {
    let output = items;

    const params = filtersValuesToQueryParams(currentFilters);

    output = output.filter((item: Item) => {
        let include = true;

        Object.keys(params).forEach((key: string) => {
            const cleanKey = key.split('_').shift();
            const value = params[key];
            const itemValue = item[cleanKey!];

            if (key.includes('_lte')) {
                include = include && value >= itemValue;
            } else if (key.includes('_gte')) {
                include = include && value <= itemValue;
            } else {
                include = include && value.some((v: any) => v === itemValue);
            }
        });

        return include;
    });

    return output;
};

export const filtersValuesToQueryParams = (filter: FilterValues) => {
    return Object.keys(filter).reduce((output: any, key: string) => {
        return {
            ...output,
            ...filterValueToQueryParams(filter[key]),
        };
    }, {} as any);
};

export const filterValueToQueryParams = (
    filterValue: FilterValue
): QueryParams => {
    let output = {} as any;
    const { config, value } = filterValue;
    const { key, type } = config;

    switch (type) {
        case FilterType.VALUE:
            value.forEach((item: FilterOption) => {
                const { params = [] } = item;
                output[key] = output[key] || [];
                output[key].push(...params);
            });
            break;
        case FilterType.RANGE:
            value.forEach((item: FilterOption) => {
                const { params = [] } = item;
                const range = params[0];
                output = { ...output, ...calcRange(key, range) };
            });
            break;
        case FilterType.DATE_RANGE:
            value.forEach((item: FilterOption) => {
                const { params = [] } = item;
                const range = replaceDates(params[0]);
                output = { ...output, ...calcRange(key, range, '~') };
            });
            break;
    }

    return output;
};

function calcRange(key: string, range: string, delimiter: string = '-') {
    let output = {} as any;

    if (range.includes(delimiter)) {
        const parts = range.split(delimiter);
        if (parts[0]) {
            output[`${key}_gte`] = parts[0];
        }
        output[`${key}_lte`] = parts[1];
    } else if (range.includes('+')) {
        const parts = range.split('+');
        output[`${key}_gte`] = parts[0];
    } else {
        output[`${key}_lte`] = range;
        output[`${key}_gte`] = range;
    }

    return output;
}

function replaceDates(str: string) {
    let output = str;

    output = output.replace(
        /(today|weekStart|weekEnd|monthStart|monthEnd|yearStart|yearEnd)([+-])(\d+)/g,
        (_all: string, period: string, sign: string, days: string) => {
            const date = periodToDate(period);
            const m = sign === '+' ? 1 : -1;

            const futureDate = add(date, {
                days: parseInt(days, 10) * m,
            });

            return format(futureDate, 'yyyy-MM-dd');
        }
    );

    output = output.replace(
        /(today|weekStart|weekEnd|monthStart|monthEnd|yearStart|yearEnd)/g,
        (_all: string, period: string) => {
            const date = periodToDate(period);
            return format(date, 'yyyy-MM-dd');
        }
    );

    return output;
}

function periodToDate(period: string) {
    switch (period) {
        case 'today':
            return today();
        case 'weekStart':
            return weekStart();
        case 'weekEnd':
            return weekEnd();
        case 'monthStart':
            return monthStart();
        case 'monthEnd':
            return monthEnd();
        case 'yearStart':
            return yearStart();
        case 'yearEnd':
            return yearEnd();
    }

    return today();
}
