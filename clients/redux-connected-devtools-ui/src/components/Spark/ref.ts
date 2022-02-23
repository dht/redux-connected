export const request = {
    '0': {
        status: 'WAITING',
        retriesCount: 0,
        isCompleted: false,
        journey: [
            {
                timestamp: 1631746711532,
                title: 'added to queue',
            },
        ],
        meta: {
            id: 'e3e77c7b-2c70-48a6-bc29-aa79ca5be37c',
            shortId: 'e37c',
            createdTS: 1631746711487,
            sequence: 1,
        },
        connectionType: 'REST',
        apiVerb: 'get',
        nodeName: 'chats',
        nodeType: 'GROUPED_LIST_NODE',
        originalAction: {
            '@@redux-connected/ACTION_ID':
                '42247887-4287-4b80-8e9c-56b7aab853d1',
            type: 'GET_CHATS',
            payload: {},
            '@@redux-store-generator/AUTO_GENERATED_ACTION': true,
            actionLogId: '11655d39-0e15-435f-bd14-baae2aeb1871',
        },
        params: {},
        path: '/chats',
        method: 'GET',
        resourcePath: '/chats',
    },
};

export const actionLog = {
    '0': {
        journey: [
            {
                timestamp: 1631746711486,
                title: 'created',
            },
        ],
        lifecyclePhase: 'RECEIVED',
        meta: {
            id: '11655d39-0e15-435f-bd14-baae2aeb1871',
            shortId: '1871',
            createdTS: 1631746711486,
            sequence: 1,
        },
        action: {
            type: 'GET_CHATS',
            payload: {},
            '@@redux-store-generator/AUTO_GENERATED_ACTION': true,
        },
    },
};
