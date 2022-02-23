import { API, Json } from './base';

export class Firestore extends API {
    constructor(json: Json) {
        super(json);
    }
}
