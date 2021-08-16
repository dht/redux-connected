import { Json } from 'redux-store-generator';
import { ResponseBuilder } from '../../../sagas/_utils/ResponseBuilder';
import {
    ApiRequest,
    ApiResponse,
    ApiServerConfiguration,
} from '../../../types/types';
import { AxiosInstance, AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';

export class JsonServerAdapter {
    private instance: JsonServerClient;

    constructor(configuration: ApiServerConfiguration) {
        this.instance = new JsonServerClient(configuration);
    }

    fireRequest = (request: ApiRequest): Promise<ApiResponse> => {
        if (this.instance) {
            console.log('1 ->', 1);
        }

        const response = new ResponseBuilder(request);
        const type = request.nodeType.toLocaleLowerCase().replace('_node', '');
        const methodName = `${type}_${request.apiVerb}`;
        const apiMethod = (this as any)[methodName];

        if (typeof apiMethod !== 'function') {
            Promise.resolve(response);
        }

        return apiMethod(request)
            .then((data: any) => {
                response.withData(data).withIsSuccess(true).withData(data);
                return response.build();
            })
            .catch((error: any) => {
                console.log('Error getting documents: ', error);
                return response.build();
            });
    };
}

type JsonServerClientConfig = ApiServerConfiguration & {
    refPath?: string[];
};

export class JsonServerClient {
    private refPath: string[] = [];
    private axios: AxiosInstance;

    constructor(public config: JsonServerClientConfig) {
        this.axios = config.axios;
        this.refPath = config.refPath || [];
    }

    ref = (nodeName: string): JsonServerClient => {
        const refPath = [...this.refPath, nodeName];

        const newInstance = new JsonServerClient({
            ...this.config,
            refPath,
        });

        return newInstance;
    };

    generatePath = () => {
        const path = this.refPath.join('/');
        return `/${path}`;
    };

    push = (data: Json) => {
        const path = this.generatePath();
        data.id = uuidv4();
        return this.axios.post(path, data);
    };

    remove = (): Promise<AxiosResponse> => {
        const path = this.generatePath();
        return this.axios.delete(path);
    };

    set = (data: Json): Promise<AxiosResponse> => {
        const path = this.generatePath();
        return this.axios.put(path, data);
    };
}
