import { itemsToObject } from './adapterBase';
import {
    ApiRequest,
    ApiServerConfiguration,
    Adapter,
    ApiResponse,
} from '../types';
import { AxiosInstance, AxiosResponse } from 'axios';
import { NodeType } from 'redux-store-generator';
import { ResponseBuilder } from '../utils/ResponseBuilder';

export class RestAdapter implements Adapter {
    private instance: AxiosInstance;

    constructor(configuration: ApiServerConfiguration) {
        this.instance = configuration.axios;
    }

    GET = (request: ApiRequest, response: ResponseBuilder) => {
        const { path, params: inParams = {} } = request;

        const params = { ...inParams };
        if (inParams.deep && request.nodeType === NodeType.GROUPED_LIST_NODE) {
            const itemsKey = request.nodeName + 'Items';
            params['_embed'] = itemsKey;
            delete params['deep'];
            response.withTransformer((item: any) => {
                const newItem = { ...item };
                newItem['items'] = newItem[itemsKey];
                delete newItem[itemsKey];
                return newItem;
            });
        }

        return this.instance.get(path, { params });
    };

    POST = (request: ApiRequest, _response: ResponseBuilder) => {
        const { path, params: data } = request;
        return this.instance.post(path, data);
    };

    PATCH = (request: ApiRequest, _response: ResponseBuilder) => {
        const { path, params: data } = request;
        return this.instance.patch(path, data);
    };

    PUT = (request: ApiRequest, _response: ResponseBuilder) => {
        const { path, params: data } = request;
        return this.instance.put(path, data);
    };

    DELETE = (request: ApiRequest, _response: ResponseBuilder) => {
        const { path } = request;
        return this.instance.delete(path);
    };

    parseReturnedData(request: ApiRequest, res: AxiosResponse) {
        const { data } = res;

        if (request.method === 'GET') {
            switch (request.nodeType) {
                case NodeType.COLLECTION_NODE:
                    return itemsToObject(data);
                default:
                    return data;
            }
        } else {
            return data;
        }
    }

    fireRequest = (request: ApiRequest): Promise<ApiResponse> => {
        const response = new ResponseBuilder(request);

        const apiMethod = this[request.method];

        if (typeof apiMethod !== 'function') {
            Promise.resolve(response);
        }

        return new Promise((resolve) => {
            apiMethod(request, response)
                .then((res: AxiosResponse) => {
                    response.withIsSuccess(true).withAxiosResponse(res);
                    const data = this.parseReturnedData(request, res);
                    response.withData(data);
                })
                .catch(function (error: any) {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        const { status } = error.response;

                        const errorType =
                            status === 401 ? 'authorization' : 'server';

                        response
                            .withErrorType(errorType)
                            .withAxiosResponse(error.response);
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        response.withErrorType('timeout');
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        response
                            .withErrorType('javascript')
                            .withErrorMessage(error.message);
                    }
                })
                .finally(() => {
                    resolve(response.build());
                });
        });
    };
}

/*
    checkConnection(url: string): Promise<boolean> {
        return new Promise((resolve) => {
            axios
                .get(url)
                .then(() => {
                    resolve(true);
                })
                .catch(function () {
                    resolve(false);
                });
        });
    }
    */
