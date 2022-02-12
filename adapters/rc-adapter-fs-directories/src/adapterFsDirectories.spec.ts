import { FsExtra } from './adapterFsDirectories';
import { Chance } from 'chance';
import fs from 'fs';
import rimraf from 'rimraf';

const ROOT = './src/__fixtures__/fsExtra';

const chance = new Chance();

describe('FsExtra', () => {
    let fsExtra, exists, dir;

    beforeAll(() => {
        fsExtra = new FsExtra({ fs });
        rimraf.sync(ROOT);
        fs.mkdirSync(ROOT);
    });

    afterAll(() => {
        rimraf.sync(ROOT);
    });

    it('mkdirSync', () => {
        dir = ROOT + '/' + [chance.word(), chance.word(), chance.word()].join('/'); // prettier-ignore
        fsExtra.mkdirSync(dir);
        exists = fs.existsSync(dir);
        expect(exists).toBe(true);
    });

    it('rmdirSync', () => {
        dir = ROOT + '/' + [chance.word(), chance.word(), chance.word()].join('/'); // prettier-ignore
        fsExtra.mkdirSync(dir);
        fsExtra.rmdirSync(dir, true);
        exists = fs.existsSync(dir);
        expect(exists).toBe(false);
    });

    it('writeFileSyncP', () => {
        dir = ROOT + '/' + [chance.word(), chance.word(), chance.word()].join('/'); // prettier-ignore
        const filepath = dir + '.js';
        const content = chance.paragraph();
        fsExtra.writeFileSyncP(filepath, content);
        const result = fs.readFileSync(filepath).toString();
        expect(result).toBe(content);
    });

    it('lsSync', () => {
        const filepath1 = ROOT + '/a/b/file.json';
        const filepath2 = ROOT + '/a/file.json';
        const content = { [chance.word()]: chance.paragraph() };
        fsExtra.writeJsonSyncP(filepath1, content);
        fsExtra.writeJsonSyncP(filepath2, content);
        const result = fsExtra.lsSync(ROOT + '/a', false, false);
        expect(result).toEqual([
            {
                path: ROOT + '/a/b',
                isDir: true,
                children: [],
            },
            {
                path: ROOT + '/a/file.json',
                isDir: false,
            },
        ]);
    });

    it('lsSync recursive', () => {
        const filepath1 = ROOT + '/a/b/file.json';
        const filepath2 = ROOT + '/a/file.json';
        const content = { [chance.word()]: chance.paragraph() };
        fsExtra.writeJsonSyncP(filepath1, content);
        fsExtra.writeJsonSyncP(filepath2, content);
        const result = fsExtra.lsSync(ROOT + '/a', true, false);
        expect(result).toEqual([
            {
                path: ROOT + '/a/b',
                isDir: true,
                children: [
                    {
                        path: ROOT + '/a/b/file.json',
                        isDir: false,
                    },
                ],
            },
            {
                path: ROOT + '/a/file.json',
                isDir: false,
            },
        ]);
    });

    it('lsSync recursive with content', () => {
        const filepath1 = ROOT + '/a/b/file.json';
        const filepath2 = ROOT + '/a/file.json';
        const content = { [chance.word()]: chance.paragraph() };
        fsExtra.writeJsonSyncP(filepath1, content);
        fsExtra.writeJsonSyncP(filepath2, content);
        const result = fsExtra.lsSync(ROOT + '/a', true, true);
        expect(result).toEqual([
            {
                path: ROOT + '/a/b',
                isDir: true,
                children: [
                    {
                        path: ROOT + '/a/b/file.json',
                        isDir: false,
                        content,
                    },
                ],
            },
            {
                path: ROOT + '/a/file.json',
                isDir: false,
                content,
            },
        ]);
    });
});
