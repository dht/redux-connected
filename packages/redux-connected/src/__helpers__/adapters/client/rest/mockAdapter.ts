import { RestAdapter } from '../../../../adapters/client/rest/adapterRest';

export const mockAdapter = new RestAdapter({
    baseURL: 'http://localhost:3000',
});
