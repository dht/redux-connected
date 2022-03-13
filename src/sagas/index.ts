import incoming from './incoming';
import postAction from './postAction';
import requests from './requests';

const sagas: any = {
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
};

export default sagas;
