import { API, Json } from './base';

export class Hasura extends API {
    constructor(json: Json) {
        super(json);
    }
}
