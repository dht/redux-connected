import { JsonServerAdapter } from '../../../../adapters/client/jsonServer/jsonServer';

export const mockAdapter = new JsonServerAdapter({
    baseURL: 'http://localhost:3000',
});
