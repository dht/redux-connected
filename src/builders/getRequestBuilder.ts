import { Filter, GetParams, Json, FieldValue } from '../types';
import { isEmpty, toArray } from '../adapters/utils/object';
import {
    GetRequestBuilderRules,
    rules,
} from './RulesBuilder';

export type GetRequest = {
    path: string;
    headers: Json;
    data: Json;
    params: FieldValue[];
    isInvalid?: boolean;
    invalidMessage?: string;
};

export class GetRequestBuilder {
    private request: GetRequest = {
        path: '',
        headers: {},
        data: {},
        params: [],
    };
    private rules: GetRequestBuilderRules = rules;
    private getParams: GetParams = {};

    constructor() {}

    withPath(path: string) {
        this.request.path = path;
        return this;
    }

    withRules(rules: GetRequestBuilderRules) {
        this.rules = rules;
        return this;
    }

    withGetParams(getParams: GetParams) {
        this.getParams = getParams || {};
        return this;
    }

    withMergedGetParamsFilters(filterOrFilters: Filter | Filter[]) {
        this.getParams.filter = [
            ...toArray<Filter>(this.getParams.filter || []),
            ...toArray<Filter>(filterOrFilters),
        ].filter((i) => i);

        return this;
    }

    paramsToQueryStrings() {}

    validateParams(request: GetRequest) {
        request.isInvalid = false;
        request.invalidMessage = '';
    }

    build(): GetRequest {
        let output: GetRequest = { ...this.request };

        this.validateParams(output);

        if (output.isInvalid) {
            return output;
        }

        output = this.rules.base(output, this.getParams);

        const {q, orderBy, filter, page, limit, slice, ...rest} = this.getParams

        if (q) {
            output = this.rules.fullTextSearch(output, this.getParams);
        }

        if (orderBy) {
            output = this.rules.sort(output, this.getParams);
        }

        if (filter) {
            output = this.rules.filter(output, this.getParams);
        }

        if (page || limit) {
            output = this.rules.paginate(output, this.getParams);
        }

        if (slice) {
            output = this.rules.slice(output, this.getParams);
        }

        if (rest) {
            output = this.rules.rest(output, rest);
        }

        const { params } = output;

        // params
        if (!isEmpty(params)) {
            const qs = params
                .reduce((output: string[], fieldValue: FieldValue) => {
                    output.push(
                        `${fieldValue.field}=${encodeURI(fieldValue.value)}`
                    );
                    return output;
                }, [])
                .join('&');

            output.path += `?${qs}`;
        }

        return output;
    }
}

/*
export type Order = 'asc' | 'desc';

export type Relation = '==' | '<=' | '<' | '>' | '>=' | '!=' | '//g';

export type Filter = {
    field: string;
    relation: Relation;
    value: string | number | boolean;
};

export type OrderBy = {
    field: string;
    order?: Order;
};

export type Q = {
    field: string;
    value: any;
};

export type Slice = {
    start?: number;
    end?: number;
};

export type GetParams = Partial<{
    q: Q;
    orderBy: OrderBy | OrderBy[];
    filter: Filter | Filter[];
    limit: number;
    page: number;
    withSubitems: boolean;
}>;

*/
