import axios from 'axios';
import { RestAdapter } from '../../../../adapters/client/rest/adapterRest';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
});

export const mockAdapter = new RestAdapter({
    axios: axiosInstance,
});
