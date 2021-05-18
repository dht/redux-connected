import { FilterType, FilterConfig, FilterValue } from '../src/types/types';

const value: FilterConfig = {
    key: 'color',
    title: 'Color',
    type: FilterType.VALUE,
    allowMultiSelect: true,
    options: [
        {
            key: 'brown',
            title: 'Brown',
            params: ['brown'],
        },
        {
            key: 'green',
            title: 'Green',
            params: ['green'],
        },
    ],
};

const range: FilterConfig = {
    key: 'price',
    title: 'Price',
    type: FilterType.RANGE,
    options: [
        {
            key: '0-25',
            title: 'Under $25',
            params: ['0-25'],
        },
        {
            key: '200+',
            title: '$200 & above',
            params: ['200+'],
        },
        {
            key: '-200',
            title: 'under $200',
            params: ['-200'],
        },
    ],
};

const date: FilterConfig = {
    key: 'shippingDate',
    title: 'Shipping Date',
    type: FilterType.DATE_RANGE,
    options: [
        {
            key: 'thisWeek',
            title: 'This Week',
            params: ['today~today+7'],
        },
        {
            key: 'last30',
            title: 'Last 30 days',
            params: ['today-30~today'],
        },
        {
            key: 'week-+',
            title: 'Last week until next week',
            params: ['today-7~today+7'],
        },
        {
            key: 'today',
            title: 'Today',
            params: ['today'],
        },
        {
            key: 'thisWeek',
            title: 'This week',
            params: ['weekStart~weekEnd'],
        },
        {
            key: 'thisMonth',
            title: 'This month',
            params: ['monthStart~monthEnd'],
        },
        {
            key: 'thisYear',
            title: 'This year',
            params: ['yearStart~yearEnd'],
        },
    ],
};

const all: any = {
    value,
    range,
    date,
};

export const buildFilterValue = (type: string, optionsIndexes: number[]): FilterValue => {
    const config = all[type] as FilterConfig;

    const options = config.options.filter((option, index) => optionsIndexes.includes(index));

    return {
        config,
        value: options,
    };
};
