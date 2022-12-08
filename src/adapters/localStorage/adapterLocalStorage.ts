import { Adapter, ApiRequest, ApiResponse, Json } from '../../types';
import { guid4, getJson, setJson, isEmpty } from 'shared-base';
import { itemsToObject, ts } from 'shared-base';
import { NodeType } from 'redux-store-generator';
import { ResponseBuilder } from '../_base/ResponseBuilder';
import {
    LocalStorageQueryBuilder,
    StorageXPath,
} from './LocalStorageQueryBuilder';
import {
    deleteByPredicate,
    deleteXPath,
    getXPath,
    initStorage,
    KEY,
    patchXPath,
    setXPath,
} from './localStorage.methods';

export class LocalStorageAdapter implements Adapter {
    constructor(private config: Json) {
        initStorage({
            getJson,
            setJson,
        });
    }

    init = async () => {
        const { on, url } = this.config;

        if (!on) {
            return;
        }

        let data = getJson(KEY);

        if (!data || isEmpty(data)) {
            const response = await fetch(url).then((res) => res.json());
            setJson(KEY, response.data ?? {});
        }
    };

    GET = async (
        request: ApiRequest,
        response: ResponseBuilder
    ): Promise<LocalStorageResponse> => {
        const storageXPath = new LocalStorageQueryBuilder()
            .withApiRequest(request)
            .build();

        const data = getXPath(storageXPath);

        response.withData(data);

        return {
            data,
        };
    };

    POST_main = async (request: ApiRequest, response: ResponseBuilder) => {
        const { argsNodeName, argsParams: data = {} } = request;

        let getData, itemToAdd;

        itemToAdd = this.withDates(data, true, true);

        const { id = guid4() } = data;

        const storageXPath = {
            key: argsNodeName,
            xpath: id,
        };

        patchXPath(storageXPath, { ...data, id });
        getData = getXPath(storageXPath);

        response.withData(getData);

        return {
            data: getData,
        };
    };

    POST_sub = async (request: ApiRequest, response: ResponseBuilder) => {
        const { argsNodeName, argsParams: data = {}, resourceId: id } = request;

        let getData, itemToAdd;

        const { id: itemId = guid4() } = data.items[0];

        itemToAdd = this.withDates(data.items[0], true, true);

        const storageXPath = {
            key: argsNodeName + 'Items',
            xpath: itemId,
        };

        setXPath(storageXPath, data);
        getData = getXPath(storageXPath);

        response.withData(getData);

        return {
            data: getData,
        };
    };

    POST_withItems = async (request: ApiRequest, response: ResponseBuilder) => {
        const { argsNodeName, argsParams: data = {}, resourceId } = request;

        let getData, itemToAdd, listItemToAdd;

        const id = resourceId || data.id || guid4();

        const { items = [] } = data;

        itemToAdd = this.withDates(data, true, true);
        delete itemToAdd['items'];

        const storageXPath = {
            key: argsNodeName,
            xpath: id,
        };

        setXPath(storageXPath, itemToAdd);
        getData = getXPath(storageXPath);

        items.forEach((item: any) => {
            const { id: itemId = guid4() } = item;
            listItemToAdd = this.withDates(item, true, true);
            listItemToAdd.parentId = id;

            const itemStorageXPath = {
                key: argsNodeName + 'Items',
                xpath: itemId,
            };

            setXPath(itemStorageXPath, listItemToAdd);
        });

        response.withData(getData);

        return {
            data: getData,
        };
    };

    POST = async (request: ApiRequest, response: ResponseBuilder) => {
        const { argsApiVerb, argsParams: data = {} } = request;

        if (argsApiVerb === 'pushItem') {
            return this.POST_sub(request, response);
        } else if (data.items) {
            return this.POST_withItems(request, response);
        } else {
            return this.POST_main(request, response);
        }
    };

    PATCH = async (request: ApiRequest, response: ResponseBuilder) => {
        let {
            argsNodeName,
            argsApiVerb,
            argsParams,
            resourceId: id,
            resourceItemId: itemId,
        } = request;

        const data = { ...argsParams };

        let nodeName = argsNodeName;

        if (request.argsNodeType === NodeType.SINGLE_NODE) {
            nodeName = 'singles';
            id = argsNodeName;
        }

        if (!id) {
            return Promise.resolve(false);
        }

        let storageXPath: StorageXPath;

        if (argsApiVerb === 'patchItem') {
            storageXPath = {
                key: nodeName + 'Items',
                xpath: itemId,
            };
        } else {
            storageXPath = {
                key: nodeName,
                xpath: id,
            };
        }

        patchXPath(storageXPath, data);
        const getData = getXPath(storageXPath);

        response.withData(getData);

        return {
            data: getData,
        };
    };

    PUT = (request: ApiRequest, _response: ResponseBuilder) => {
        const { argsParams: data } = request;
        return Promise.resolve();
    };

    DELETE_withItems = async (
        request: ApiRequest,
        _response: ResponseBuilder
    ) => {
        const { argsNodeName, argsParams: data = {}, resourceId: id } = request;

        let ref;

        if (!id) {
            return Promise.resolve(false);
        }

        let storageXPath = {
            key: argsNodeName,
            xpath: id,
        };

        deleteXPath(storageXPath);

        deleteByPredicate(
            argsNodeName + 'Items',
            (item) => item.parentId === id
        );

        return {};
    };

    DELETE = async (request: ApiRequest, _response: ResponseBuilder) => {
        const {
            argsApiVerb,
            argsNodeType,
            argsNodeName,
            resourceId: id,
            resourceItemId: itemId,
        } = request;

        if (!id) {
            return Promise.resolve(false);
        }

        let storageXPath = {
            key: argsNodeName,
            xpath: id,
        };

        if (argsNodeType === 'GROUPED_LIST_NODE') {
            if (argsApiVerb === 'deleteItem') {
                storageXPath = {
                    key: argsNodeName + 'Items',
                    xpath: itemId,
                };
            } else {
                return this.DELETE_withItems(request, _response);
            }
        }

        deleteXPath(storageXPath);
    };

    _logRequest(request: ApiRequest) {
        console.log(JSON.stringify(request, null, 4));
    }

    parseReturnedData(request: ApiRequest, res: LocalStorageResponse) {
        const { data } = res;

        if (request.argsMethod === 'GET') {
            switch (request.argsNodeType) {
                case NodeType.SINGLE_NODE:
                    return data;
                case NodeType.COLLECTION_NODE:
                    return data;

                case NodeType.GROUPED_LIST_NODE:
                    if (request.argsApiVerb === 'getItems') {
                        return data;
                    }

                    return data;
                default:
                    return data;
            }
        } else {
            return data;
        }
    }

    fireRequest = (request: ApiRequest): Promise<ApiResponse> => {
        const response = new ResponseBuilder(request);

        const apiMethod = this[request.argsMethod];

        if (typeof apiMethod !== 'function') {
            Promise.resolve(response);
        }

        return new Promise((resolve) => {
            apiMethod(request, response)
                .then((_res: any) => {
                    const res = _res as LocalStorageResponse;
                    response.withIsSuccess(true);
                    const data = this.parseReturnedData(request, res);
                    response.withData(data);

                    resolve(response.build());
                })
                .catch(function (error: any) {
                    response
                        .withErrorType('javascript')
                        .withErrorMessage(error.message);

                    resolve(response.build());
                });
        });
    };

    withDates(data: Json, withCreatedDate: boolean, withModifiedDate: boolean) {
        let output = { ...data };

        if (withCreatedDate) {
            output = { ...output, _createdDate: ts() };
        }

        if (withModifiedDate) {
            output = { ...output, _modifiedDate: ts() };
        }

        return output;
    }
}

export type LocalStorageResponse = {
    data: Json[];
};
