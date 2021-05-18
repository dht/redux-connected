import { Adapter, ApiResponse } from '../../../types/types';
import { ResponseBuilder } from '../../../sagas/_utils/ResponseBuilder';
import { ApiRequest, ApiServerConfiguration } from '../../../types/types';
import { AxiosInstance, AxiosResponse } from 'axios';
import { Json, NodeType } from 'redux-store-generator';
import { itemsToObject } from '../../../sagas/_utils/object';

export class SocketsAdapter implements Adapter {
    private instance: AxiosInstance;

    constructor(configuration: ApiServerConfiguration) {
        this.instance = configuration.axios;
    }

    GET(path: string, params?: Json) {
        return this.instance.get(path, { params });
    }

    POST(path: string, data?: Json) {
        return this.instance.post(path, data);
    }

    PATCH(path: string, data?: Json) {
        return this.instance.patch(path, data);
    }

    PUT(path: string, data?: Json) {
        return this.instance.put(path, data);
    }

    DELETE(path: string) {
        return this.instance.delete(path);
    }

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
        const { path, params } = request;

        const response = new ResponseBuilder(request);

        const apiMethod = this[request.method];

        if (typeof apiMethod !== 'function') {
            Promise.resolve(response);
        }

        return new Promise((resolve) => {
            apiMethod(path, params)
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
