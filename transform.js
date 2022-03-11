import * as globby from 'globby';
import * as fs from 'fs';

const cwd = './src';

const files = globby.globbySync('**/*.js', {
    cwd,
});

files.forEach((file) => {
    fs.renameSync(`${cwd}/${file}`, `${cwd}/${file.replace(/\.js/, '.tsx')}`);
});
