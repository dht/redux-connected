import { small } from '@rc-adapter-fixtures';
import { Fs } from './clients';
import { FsDirectory } from './clients/fsDirectory';

const fs = () => {
    const fs = new Fs(small, './_playground/fs');
    fs.scaffold();
};

const fsDirectory = () => {
    const fsDirectory = new FsDirectory(small, './_playground/fsDirectory');
    fsDirectory.scaffold();
};

const run = async () => {
    // fs();
    fsDirectory();
};

run();
