import { Json } from '../types';

export const sendState = (state: any) => {
    window.postMessage(
        {
            type: 'CONNECTED_STATE',
            source: 'devtools-page',
            payload: {
                state,
            },
        },
        '*'
    );
};

const fixJson = (json: Json) => JSON.parse(JSON.stringify(json));

export const sendAction = (action: any) => {
    window.postMessage(
        {
            type: 'CONNECTED_ACTION',
            source: 'devtools-page',
            payload: {
                action: fixJson(action),
            },
        },
        '*'
    );
};
