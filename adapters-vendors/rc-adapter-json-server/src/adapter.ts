import { ApiRequest, ApiResponse } from 'redux-connected-types';
import { ResponseBuilder } from 'rc-adapter-base';
import {
    JsonServerClient,
    JsonServerClientConfiguration,
} from './client/jsonServerClient';

export class JsonServerAdapter {
    private instance: JsonServerClient;

    constructor(configuration: JsonServerClientConfiguration) {
        this.instance = new JsonServerClient(configuration);
    }

    collection_get = (request: ApiRequest) => {
        return this.instance.get(`/${request.nodeName}`);
    };

    grouped_list_get = (request: ApiRequest) => {
        return this.instance.get(`/${request.nodeName}`);
    };

    fireRequest = (request: ApiRequest): Promise<ApiResponse> => {
        const response = new ResponseBuilder(request);
        const type = request.nodeType.toLocaleLowerCase().replace('_node', '');
        const methodName = `${type}_${request.apiVerb}`;

        const apiMethod = (this as any)[methodName];

        if (typeof apiMethod !== 'function') {
            return Promise.resolve(response.build() as ApiResponse);
        }

        return apiMethod(request)
            .then((data: any) => {
                response.withData(data).withIsSuccess(true).withData(data);
                return response.build();
            })
            .catch((error: any) => {
                console.log('Error getting items: ', error);
                return response.build();
            });
    };
}
