import axios from 'axios';
import { RestAdapter } from '@rc-adapter-rest';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
});

export const restAdapter = new RestAdapter({
    axios: axiosInstance,
});
