import { ITimeline } from './initialState';

export const timeline: ITimeline = {
    midFilter: {
        id: 'midFilter',
        description: 'midFilter',
        items: [
            {
                id: '1',
                counter: 1,
                timestamp: 1000,
                data: {},
            },
        ],
    },
    get: {
        id: 'get',
        description: 'get',
        items: [
            {
                id: '1',
                counter: 1,
                timestamp: 1000,
                data: {},
            },
        ],
    },
    save: {
        id: 'save',
        description: 'save',
        items: [
            {
                id: '1',
                counter: 1,
                timestamp: 1000,
                data: {},
            },
        ],
    },
    requests: {
        id: 'requests',
        description: 'requests',
        items: [
            {
                id: '1',
                counter: 1,
                timestamp: 1000,
                data: {},
            },
        ],
    },
};

export const timelineEmpty = Object.keys(timeline).reduce((output, key) => {
    output[key] = {
        ...timeline[key],
        items: [],
    };
    return output;
}, {} as ITimeline);
