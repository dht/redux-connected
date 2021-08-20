import { ColumnType, ColumnConfig } from 'redux-connected-components';
import { FilterType, FilterConfig } from 'redux-connected-components';
import { FieldType, Field } from 'redux-connected-components';
import { actions as allActions } from '../redux/store';
import * as allSelectors from '../redux/selectors';

export const columns: ColumnConfig[] = [
    {
        key: 'thumbnail',
        title: '-',
        width: 50,
        columnType: ColumnType.THUMBNAIL,
    },
    {
        key: 'title',
        title: "Product's Name",
        width: 300,
        columnType: ColumnType.TEXT,
    },
    {
        key: 'price',
        title: 'Price',
        width: 100,
        columnType: ColumnType.PRICE,
    },
    {
        key: 'color',
        title: 'Color',
        width: 200,
        columnType: ColumnType.TEXT,
    },
    {
        key: 'shippingDate',
        title: 'Shipping date',
        width: 200,
        columnType: ColumnType.DATE,
    },
    {
        key: 'actions',
        title: '',
        width: 180,
        columnType: ColumnType.ACTIONS,
        actions: [
            {
                id: 'edit',
                title: 'Edit',
                icon: 'edit',
            },
            {
                id: 'delete',
                title: 'Delete',
                icon: 'delete',
            },
        ],
    },
];

export const filters: FilterConfig[] = [
    {
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
                key: '25-50',
                title: '$25-$50',
                params: ['25-50'],
            },
            {
                key: '50-100',
                title: '$50-$100',
                params: ['50-100'],
            },
            {
                key: '100-200',
                title: '$100-$200',
                params: ['100-200'],
            },
            {
                key: '200+',
                title: '$200 & above',
                params: ['200+'],
            },
        ],
    },
    {
        key: 'color',
        title: 'Color',
        type: FilterType.VALUE,
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
            {
                key: 'red',
                title: 'Red',
                params: ['red'],
            },
            {
                key: 'gold',
                title: 'Gold',
                params: ['gold'],
            },
        ],
    },
    {
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
                key: 'next30',
                title: 'Next 30 days',
                params: ['today~today+30'],
            },
            {
                key: 'next180',
                title: 'Next 180 days',
                params: ['today~today+180'],
            },
        ],
    },
];

export const fields: Field[] = [
    {
        key: 'title',
        title: 'Title',
        fieldType: FieldType.TEXT,
    },
    {
        key: 'price',
        title: 'Price',
        fieldType: FieldType.NUMBER,
    },
    {
        key: 'color',
        title: 'Color',
        fieldType: FieldType.SELECT,
        fieldOptions: [
            {
                key: 'brown',
                title: 'Brown',
            },
            {
                key: 'green',
                title: 'Green',
            },
            {
                key: 'red',
                title: 'Red',
            },
            {
                key: 'gold',
                title: 'Gold',
            },
        ],
    },
    {
        key: 'shippingDate',
        title: 'Shipping Date',
        fieldType: FieldType.DATE,
    },
    {
        key: 'thumbnail',
        title: 'Thumbnail',
        fieldType: FieldType.URL,
    },
    {
        key: 'imageUrl',
        title: 'Image URL',
        fieldType: FieldType.URL,
    },
];

export const actions = allActions.products;
export const selector = allSelectors.$products;
