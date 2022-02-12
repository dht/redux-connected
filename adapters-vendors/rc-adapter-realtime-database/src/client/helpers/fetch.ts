import fetch from 'node-fetch';
import { Json } from 'redux-connected-types';

export class Fetch {
    constructor(private apiUrl) {}

    fetch(path: string, method: string, data?: Json) {
        return fetch(`${this.apiUrl}${path}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method,
            body: data ? JSON.stringify(data) : null,
        });
    }

    get(path) {
        return this.fetch(path, 'GET').then((res) => res.json());
    }

    put(path, data) {
        return this.fetch(path, 'PUT', data);
    }

    post(path, data) {
        return this.fetch(path, 'POST', data);
    }

    delete(path) {
        return this.fetch(path, 'DELETE');
    }
}
