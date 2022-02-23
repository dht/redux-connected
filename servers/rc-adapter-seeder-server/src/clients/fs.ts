import { API, Json } from './base';
import fs from 'fs-extra';

export class Fs extends API {
    private dbPath: string;

    constructor(json: Json, path: string) {
        super(json);

        fs.mkdirSync(path, { recursive: true });
        this.dbPath = `${path}/db.json`;
    }

    scaffold() {
        fs.writeJsonSync(this.dbPath, this.json, { spaces: 4 });
    }
}
