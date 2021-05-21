import axios from 'axios';
import { JsonServerAdapter } from '../../../../adapters/client/jsonServer/jsonServer';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
});

export const mockAdapter = new JsonServerAdapter({
    axios: axiosInstance,
});
