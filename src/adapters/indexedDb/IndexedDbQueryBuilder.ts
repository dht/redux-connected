import { ApiRequest } from '../../types';

export type StorageXPath = {
    key: string;
    xpath?: string;
};

export class IndexedDbQueryBuilder {
    private storageXPath: StorageXPath = {
        key: '',
        xpath: '',
    };
    private apiRequest?: ApiRequest;

    constructor() {}

    withApiRequest(apiRequest: ApiRequest) {
        this.apiRequest = apiRequest;
        return this;
    }

    build(): StorageXPath {
        const { argsNodeName, argsApiVerb, argsNodeType, resourceId } = this.apiRequest!; // prettier-ignore

        switch (argsNodeType) {
            case 'SINGLE_NODE':
                this.storageXPath.key = 'singles';
                this.storageXPath.xpath = argsNodeName;
                break;
            case 'GROUPED_LIST_NODE':
                this.storageXPath.key = argsNodeName;
                if (argsApiVerb === 'getItems') {
                    this.storageXPath.key += 'Items';
                    this.storageXPath.xpath = resourceId;
                }
            case 'COLLECTION_NODE':
            default:
                this.storageXPath.key = argsNodeName;
        }

        return this.storageXPath;
    }
}
