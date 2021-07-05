import { Sagas } from '../types/types';
import get from './get/get';
import { internet } from './internet/internet';
import logger from './logger/logger';
import requests from './requests/requests';
import save from './save/save';

const sagas: Sagas = {
    get: {
        saga: get,
        description: 'Handles data fetches from server, including pagination',
    },
    logger: {
        saga: logger,
        description: 'Captures logs system-wide',
    },
    requests: {
        saga: requests,
        description:
            'Handles all XHR requests, implement error handling and retries.',
    },
    save: {
        saga: save,
        description:
            'Handles all POST, PUT and PATCH actions, anything with side-effect',
    },
    internet: {
        saga: internet,
        description: 'Checks whether an internet connection is available',
    },
};

export default sagas;
