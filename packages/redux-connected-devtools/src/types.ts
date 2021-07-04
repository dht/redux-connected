export type Json = Record<string, any>;

export type IAction = Json & {
    type: string;
};

export type IEvent = {
    id: string;
    timestamp: number;
    action: IAction;
};

export type ISaga = {
    id: string;
    description: string;
    isRunning: boolean;
    isListening: boolean;
    runningCount: number;
    startedTS?: number;
    stoppedTS?: number;
    actionTypes: string[];
    items: IEvent[];
    showOnTimeline: boolean;
};
