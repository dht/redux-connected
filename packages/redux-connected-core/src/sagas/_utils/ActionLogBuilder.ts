import { ts } from './../../utils/data';
import {
    ActionLog,
    ActionLifecycle,
    ActionWithPayload,
    Json,
} from 'redux-connected-types';
import { generateMeta } from './meta';

let sequence = 1;

export class ActionLogBuilder {
    private output: Partial<ActionLog> = {
        journey: [],
        lifecyclePhase: ActionLifecycle.RECEIVED,
    };

    constructor() {
        this.output.meta = generateMeta(sequence++);
    }

    withJourneyPoint(title: string, data?: Json) {
        this.output.journey?.push({
            timestamp: ts(),
            title,
            data,
        });
        return this;
    }

    withAction(action: ActionWithPayload<any>) {
        this.output.action = action;
        return this;
    }

    build(): ActionLog {
        return this.output as ActionLog;
    }
}
