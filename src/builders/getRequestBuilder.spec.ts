import { GetParams } from '../types';
import { GetRequestBuilder } from './getRequestBuilder';

describe('UrlBuilder', () => {
    let builder: GetRequestBuilder, p: GetParams;

    beforeEach(() => {
        builder = new GetRequestBuilder().withPath('/logs');
    });

    it('empty getParams', () => {
        expect(builder.withGetParams({}).build().path).toEqual('/logs');
    });

    it('full-text search', () => {
        p = {
            q: {
                value: 'internet',
            },
        };
        expect(builder.withGetParams(p).build().path).toEqual(
            '/logs?q=internet'
        );
    });

    it('sort by a single field', () => {
        p = {
            orderBy: {
                field: 'views',
                order: 'asc',
            },
        };
        expect(builder.withGetParams(p).build().path).toEqual(
            '/logs?_sort=views&_order=asc'
        );
    });

    it('sort by a multiple fields', () => {
        p = {
            orderBy: [
                {
                    field: 'user',
                    order: 'desc',
                },
                {
                    field: 'views',
                    order: 'asc',
                },
            ],
        };
        expect(builder.withGetParams(p).build().path).toEqual(
            '/logs?_sort=user,views&_order=desc,asc'
        );
    });

    it('sort by a single field with no order', () => {
        p = {
            orderBy: {
                field: 'views',
            },
        };
        expect(builder.withGetParams(p).build().path).toEqual(
            '/logs?_sort=views&_order=asc'
        );
    });

    it('filter by a single field', () => {
        p = {
            filter: {
                field: 'price',
                relation: '==',
                value: 30,
            },
        };
        expect(builder.withGetParams(p).build().path).toEqual('/logs?price=30');
    });

    it('filter by a deep field', () => {
        p = {
            filter: {
                field: 'author.name',
                relation: '==',
                value: 'jimmy',
            },
        };
        expect(builder.withGetParams(p).build().path).toEqual(
            '/logs?author.name=jimmy'
        );
    });

    it('filter by multiple values for same fields', () => {
        p = {
            filter: [
                {
                    field: 'id',
                    relation: '==',
                    value: 1,
                },
                {
                    field: 'id',
                    relation: '==',
                    value: 2,
                },
            ],
        };
        expect(builder.withGetParams(p).build().path).toEqual(
            '/logs?id=1&id=2'
        );
    });

    it('filter by multiple fields', () => {
        p = {
            filter: [
                {
                    field: 'id',
                    relation: '==',
                    value: 1,
                },
                {
                    field: 'commentId',
                    relation: '==',
                    value: 5,
                },
            ],
        };
        expect(builder.withGetParams(p).build().path).toEqual(
            '/logs?id=1&commentId=5'
        );
    });

    it('paginate', () => {
        p = {
            page: 5,
            limit: 10,
        };
        expect(builder.withGetParams(p).build().path).toEqual(
            '/logs?_page=5&_limit=10'
        );
    });

    it('slice', () => {
        p = {
            slice: {
                start: 10,
                end: 20,
            },
        };
        expect(builder.withGetParams(p).build().path).toEqual(
            '/logs?_start=10&_end=20'
        );
    });

    it('filter by range', () => {
        p = {
            filter: [
                {
                    field: 'index',
                    relation: '>=',
                    value: 1,
                },
                {
                    field: 'index',
                    relation: '<=',
                    value: 5,
                },
            ],
        };
        expect(builder.withGetParams(p).build().path).toEqual(
            '/logs?index_gte=1&index_lte=5'
        );
    });

    it('filter exclude', () => {
        p = {
            filter: {
                field: 'index',
                relation: '!=',
                value: 1,
            },
        };
        expect(builder.withGetParams(p).build().path).toEqual(
            '/logs?index_ne=1'
        );
    });

    it('filter regex', () => {
        p = {
            filter: {
                field: 'index',
                relation: '//g',
                value: '[a-z]+1',
            },
        };
        expect(builder.withGetParams(p).build().path).toEqual(
            '/logs?index_like=' + encodeURI('[a-z]+1')
        );
    });

    it('filter regex', () => {
        p = {
            withSubitems: true,
        };
        expect(builder.withGetParams(p).build().path).toEqual(
            '/logs?_expand=logItems'
        );
    });
});
