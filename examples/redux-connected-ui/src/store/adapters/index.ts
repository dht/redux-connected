import axios from 'axios';
import { JsonServerAdapter } from '@rc-adapter-json-server';
import { StoreNodeTypes, NodeType } from 'redux-store-generator';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3509/api',
});

export const structure: StoreNodeTypes = {
    user: NodeType.SINGLE_NODE,
    logs: NodeType.QUEUE_NODE,
    products: NodeType.COLLECTION_NODE,
    chats: NodeType.GROUPED_LIST_NODE,
};

export const jsonServerAdapter = new JsonServerAdapter({
    axiosInstance,
    structure,
});
