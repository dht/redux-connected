import incoming from './incoming';
import logger from './logger';
import postAction from './postAction';
import requests from './requests';
import { internet } from './internet';
import { refresh } from './refresh';
import { Sagas } from '../types';

const sagas: Sagas = {
    incoming: {
        saga: incoming,
        description:
            'Handles ALL incoming actions and starts the request lifecycle',
    },
    requests: {
        saga: requests,
        description:
            'Handles all XHR requests, implement error handling and retries.',
    },
    postAction: {
        saga: postAction,
        description:
            'Constructs the post action to send back to the main store',
    },
    logger: {
        saga: logger,
        description: 'Captures logs system-wide',
    },
    refresh: {
        saga: refresh,
        description: 'Refreshes the state of the connected store',
    },
    internet: {
        saga: internet,
        description: 'Checks whether an internet connection is available',
    },
};

export default sagas;
