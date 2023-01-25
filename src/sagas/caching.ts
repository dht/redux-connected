import { apiActions } from '../store/actions';
import { delay, put, takeEvery } from 'saga-ts';
import { ApiRequest } from '../types';
import globals from '../utils/globals';

export function* caching(request: ApiRequest) {
    yield delay(0);

    if (!globals.config.clientCaching?.enabled) {
        return;
    }

    console.log('request ->', request);

    const { argsMethod } = request;
    console.log('argsMethod ->', argsMethod);

    try {
    } catch (e) {
        console.log('e ->', e);
    }
}

export default caching;
