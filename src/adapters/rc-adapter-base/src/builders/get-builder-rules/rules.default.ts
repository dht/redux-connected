import { Filter, GetParams, OrderBy } from '../../../typ';
import { getSubitemsNodeName } from '../..';
import { toArray } from '../../utils/object';
import { GetRequest } from '../getRequestBuilder';

export type RequestDecorator = (
    request: GetRequest,
    getParams: GetParams
) => GetRequest;

export type GetRequestBuilderRules = {
    base: RequestDecorator;
    sort: RequestDecorator;
    fullTextSearch: RequestDecorator;
    filter: RequestDecorator;
    paginate: RequestDecorator;
    slice: RequestDecorator;
};

export const rules: GetRequestBuilderRules = {
    base: (request: GetRequest, getParams: GetParams) => {
        const { withSubitems } = getParams;

        if (withSubitems) {
            request.params.push({
                field: '_expand',
                value: getSubitemsNodeName(request.path),
            });
        }

        return request;
    },
    sort: (request: GetRequest, getParams: GetParams) => {
        const { orderBy } = getParams;
        const orderByArray = toArray<OrderBy>(orderBy!);

        const output = orderByArray.reduce(
            (output: any, order) => {
                output._sort.push(order.field);
                output._order.push(order.order || 'asc');
                return output;
            },
            {
                _sort: [],
                _order: [],
            }
        );

        request.params.push({
            field: '_sort',
            value: output._sort.join(','),
        });

        request.params.push({
            field: '_order',
            value: output._order.join(','),
        });

        return request;
    },
    fullTextSearch: (request: GetRequest, getParams: GetParams) => {
        const { q } = getParams;

        request.params.push({
            field: 'q',
            value: q?.value,
        });

        return request;
    },
    filter: (request: GetRequest, getParams: GetParams) => {
        const { filter } = getParams;
        const filterArray = toArray<Filter>(filter!);

        filterArray.forEach((filter) => {
            const { field, relation, value } = filter;
            let suffix = '';

            switch (relation) {
                case '==':
                    suffix = '';
                    break;
                case '>=':
                    suffix = '_gte';
                    break;
                case '<=':
                    suffix = '_lte';
                    break;
                case '!=':
                    suffix = '_ne';
                    break;
                case '//g':
                    suffix = '_like';
                    break;
            }

            request.params.push({
                field: `${field}${suffix}`,
                value: value,
            });
        });

        return request;
    },
    paginate: (request: GetRequest, getParams: GetParams) => {
        const { page, limit } = getParams;

        if (page) {
            request.params.push({
                field: '_page',
                value: page,
            });
        }

        if (limit) {
            request.params.push({
                field: '_limit',
                value: limit,
            });
        }

        return request;
    },
    slice: (request: GetRequest, getParams: GetParams) => {
        const { slice } = getParams;
        const { start, end } = slice!;

        if (start) {
            request.params.push({
                field: '_start',
                value: start,
            });
        }

        if (end) {
            request.params.push({
                field: '_end',
                value: end,
            });
        }

        return request;
    },
};
