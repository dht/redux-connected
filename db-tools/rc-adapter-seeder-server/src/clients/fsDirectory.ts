import { API, Json } from './base';
import fs from 'fs-extra';

export class FsDirectory extends API {
    private dbPath: string;

    constructor(json: Json, path: string) {
        super(json);

        fs.mkdirSync(path, { recursive: true });
        this.dbPath = path;
    }

    scaffold() {
        let filepath;
        console.log('1 ->', 1);
        Object.keys(this.json).forEach((nodeName: string) => {
            const data = this.json[nodeName];
            const type = this.identifyRootNode(nodeName);
            const path = `${this.dbPath}/${nodeName}`;
            fs.mkdirSync(path, { recursive: true });

            switch (type) {
                case 'single':
                    filepath = `${path}/${nodeName}.json`;
                    fs.writeJsonSync(filepath, data, { spaces: 4 });
                    break;
                case 'queue':
                case 'collection':
                case 'groupedList':
                    data.forEach((item: Json) => {
                        filepath = `${path}/${item.id}.json`;
                        fs.writeJsonSync(filepath, item, { spaces: 4 });
                    });
                    break;
                case 'groupedListItems':
                    const parentKey = nodeName.replace('Items', 'Id');
                    data.forEach((item: Json) => {
                        const parentId = item[parentKey];
                        const cwd = `${path}/${parentId}`;
                        fs.mkdirSync(cwd, { recursive: true });
                        filepath = `${cwd}/${item.id}.json`;
                        fs.writeJsonSync(filepath, item, { spaces: 4 });
                    });
                    break;
            }
        });
        // fs.writeJsonSync(this.dbPath, this.json, { spaces: 4 });
    }
}
