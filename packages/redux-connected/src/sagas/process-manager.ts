import { logm } from './logger/logger';
import {
    StartSagaPayload,
    StopSagaPayload,
    RunningSagas,
} from '../types/types';
import { fork, put, cancel, takeEvery, ForkEffect } from 'redux-saga/effects';
import { Action } from 'redux-store-generator';
import sagas from './index';
import { sagaActions } from '../connected/actions';
import { timestamp } from './_utils/date';

export const startSaga = (payload?: StartSagaPayload) => ({
    type: 'START_SAGA',
    payload,
});

export const stopSaga = (payload?: StopSagaPayload) => ({
    type: 'STOP_SAGA',
    payload,
});

export class ProcessManager {
    private runningSagas: RunningSagas = {} as RunningSagas;

    constructor() {
        this.run = this.run.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
    }

    *start(action: Action) {
        try {
            const { payload } = action;
            const { sagaId } = payload as StartSagaPayload;

            yield put(logm(`START_SAGA: ${sagaId}`));
            if (!sagas[sagaId]) {
                throw new Error(
                    `START_SAGA: could not find sagaId "${sagaId}"`
                );
            }
            const saga = sagas[sagaId];

            this.runningSagas[sagaId] = (yield fork(
                saga.saga
            )) as ForkEffect<any>;
            yield put(
                sagaActions.patch(sagaId, {
                    isRunning: true,
                    startedTS: timestamp(),
                })
            );
        } catch (err) {
            console.log('function* start crashed ->', err);
        }
    }

    *stop(action: Action) {
        try {
            const { payload } = action;
            const { sagaId } = payload as StopSagaPayload;

            yield put(logm(`STOP_SAGA: ${sagaId}`));
            if (!sagas[sagaId]) {
                throw new Error(`STOP_SAGA: could not find sagaId "${sagaId}"`);
            }
            yield cancel(this.runningSagas[sagaId]);
            yield put(
                sagaActions.patch(sagaId, {
                    isRunning: false,
                    stoppedTS: timestamp(),
                })
            );
        } catch (err) {
            console.log('function* stop crashed ->', err);
        }
    }

    *run() {
        yield takeEvery('START_SAGA', this.start);
        yield takeEvery('STOP_SAGA', this.stop);
        yield put(logm('process manager saga on'));
    }
}

export default ProcessManager;
