const globby = require('globby');
const fs = require('fs-extra');
const sass = require('sass');
const path = require('path');

globby.sync('./src/**/*.scss').forEach((filePath) => {
    const outFile = filePath.replace('./src/', './lib/').replace('.scss', '.css');

    const result = sass.renderSync({
        file: filePath,
        sourceMap: true,
        outFile,
    });

    const css = result.css.toString();
    const map = result.map.toString();

    fs.mkdirpSync(path.parse(outFile).dir, { rescursive: true });
    fs.writeFileSync(outFile, css);
    fs.writeFileSync(outFile + '.map', map);
    console.log(`${filePath} transpiled ${css.length.toLocaleString()} bytes`);
});

console.log('done SCSS ->', true);
