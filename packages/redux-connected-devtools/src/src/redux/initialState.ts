type Json = Record<string, any>;

export type IBlockEvent = {
    id: string;
    timestamp: number;
    counter: number;
    data: Json;
};

export type IBlock = {
    id: string;
    description: string;
    items: IBlockEvent[];
};

export type ITimeline = Record<string, IBlock>;

export type IState = {
    timeline: ITimeline;
};

export const state: IState = {
    timeline: {
        '1': {
            id: '1',
            description: 'connected',
            items: [
                {
                    id: '1',
                    timestamp: 1000,
                    counter: 1,
                    data: {
                        a: 1,
                    },
                },
            ],
        },
    },
};
