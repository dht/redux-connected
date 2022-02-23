import { NodeType } from 'redux-store-generator';
import { GetParams, Json } from 'redux-connected-types';
import {
    StoreNodeTypes,
    parsePath,
    getSubitemsNodeName,
    uuidv4,
    defaultRules,
    GetRequestBuilder,
} from 'rc-adapter-base';

export type ElasticSearchClientConfiguration = {
    axiosInstance: any;
    structure: StoreNodeTypes;
};

interface IElasticSearchClient {
    get: (path: string, params?: Json) => void;
    patch: (path: string, change: Json) => void;
    set: (path: string, value: Json) => void;
    add: (path: string, item: Json) => void;
    delete: (path: string) => void;
}

type ResourceType = 'single' | 'collection' | 'subitem' | 'unknown';

export class ElasticSearchClient implements IElasticSearchClient {
    private axios: any;

    constructor(private config: ElasticSearchClientConfiguration) {
        this.axios = this.config.axiosInstance;
    }

    fetch = (
        path: string,
        method: string = 'get',
        data?: Json,
        params?: Json
    ) => {
        return this.axios
            .request({
                url: path,
                method,
                data,
                params,
            })
            .then((res) => {
                return res.data;
            });
    };

    single = {
        get: (path: string) => {
            return this.fetch(path);
        },
        set: (path: string, value: Json) => {
            return this.fetch(path, 'PUT', value);
        },
        patch: (path: string, change: Json) => {
            return this.fetch(path, 'PATCH', change);
        },
        delete: (path: string) => {
            let { id } = parsePath(path);

            if (id) {
                return this.fetch(path, 'DELETE');
            } else {
                return this.fetch(path, 'PUT', {});
            }
        },
    };

    subItem = {
        get: (path: string, params: GetParams = {}) => {
            const { id, subItemId } = parsePath(path);
            const itemsNodeName = getSubitemsNodeName(path);

            if (!subItemId) {
                const getRequest = new GetRequestBuilder()
                    .withPath(`/${itemsNodeName}`)
                    .withGetParams(params)
                    .withMergedGetParamsFilters({
                        field: 'chatId',
                        relation: '==',
                        value: id,
                    })
                    .withRules(defaultRules)
                    .build();

                return this.fetch(getRequest.path);
            } else {
                return this.single.get(`/${itemsNodeName}/${subItemId}`);
            }
        },
        set: (path: string, value: Json) => {
            let { subItemId } = parsePath(path);
            const nodeName = getSubitemsNodeName(path);
            return this.single.set(`/${nodeName}/${subItemId}`, value);
        },
        patch: (path: string, value: Json) => {
            let { subItemId } = parsePath(path);
            const nodeName = getSubitemsNodeName(path);
            return this.single.patch(`/${nodeName}/${subItemId}`, value);
        },
        delete: (path: string) => {
            let { subItemId } = parsePath(path);
            const nodeName = getSubitemsNodeName(path);
            return this.single.delete(`/${nodeName}/${subItemId}`);
        },
    };

    collection = {
        get: (path: string, params: GetParams = {}) => {
            const getRequest = new GetRequestBuilder()
                .withPath(path)
                .withGetParams(params)
                .withRules(defaultRules)
                .build();

            return this.fetch(getRequest.path);
        },
        set: async (path: string, items: Json) => {
            await this.collection.delete(path);

            const promises = items.map((item) => {
                return this.collection.add(path, item);
            });

            return Promise.all(promises);
        },
        add: (path: string, item: Json) => {
            const newItem = { ...item };

            if (!newItem.id) {
                newItem.id = uuidv4();
            }

            return this.fetch(path, 'POST', item);
        },
        pop: async (path: string) => {
            const items = await this.collection.get(path, {
                orderBy: { field: 'id' },
            });
            const lastItem = items.pop();
            return this.single.delete(`${path}/${lastItem.id}`);
        },
        delete: async (path: string) => {
            const { nodeName } = parsePath(path);
            const items = await this.collection.get(`/${nodeName}`);

            const promises = items.map((item) => {
                return this.single.delete(`/${nodeName}/${item.id}`);
            });

            return Promise.all(promises);
        },
    };

    get(path: string, params?: GetParams) {
        switch (this.getPathType(path)) {
            case 'single':
                return this.single.get(path);
            case 'collection':
                return this.collection.get(path, params);
            case 'subitem':
                return this.subItem.get(path, params);
        }
    }

    patch(path: string, change: Json) {
        switch (this.getPathType(path)) {
            case 'single':
                return this.single.patch(path, change);
            case 'subitem':
                return this.subItem.patch(path, change);
        }
    }

    set(path: string, value: Json) {
        switch (this.getPathType(path)) {
            case 'single':
                return this.single.set(path, value);
            case 'collection':
                return this.collection.set(path, value);
            case 'subitem':
                return this.subItem.set(path, value);
        }
    }

    add(path: string, item: Json) {
        return this.collection.add(path, item);
    }

    pop(path: string) {
        return this.collection.pop(path);
    }

    delete(path: string) {
        switch (this.getPathType(path)) {
            case 'single':
                return this.single.delete(path);
            case 'collection':
                return this.collection.delete(path);
            case 'subitem':
                return this.subItem.delete(path);
        }
    }

    getPathType(path: string): ResourceType {
        const { nodeName, hasItems, id } = parsePath(path);
        const structure = this.config.structure;

        if (hasItems) {
            return 'subitem';
        }

        switch (structure[nodeName]) {
            case NodeType.SINGLE_NODE:
                return 'single';
            case NodeType.QUEUE_NODE:
            case NodeType.COLLECTION_NODE:
            case NodeType.GROUPED_LIST_NODE:
                return id ? 'single' : 'collection';
            default:
                return 'unknown';
        }
    }
}
