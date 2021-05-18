const fs = require('fs');
const globby = require('globby');

const indexLines = [];
const scssLines = [];

globby
    .sync('./src/components/*', {
        onlyDirectories: true,
    })
    .filter((path) => !path.includes('stories'))
    .forEach((path) => {
        const parts = path.split('/');
        const name = parts.pop();

        const raw = fs.readFileSync(`${path}/${name}.tsx`).toString();
        const exportsCount = raw.split(/^export /gm).length;

        const exportText = exportsCount > 4 ? `* as ${name}` : `{ ${name} }`;

        indexLines.push(`export ${exportText} from './components/${name}/${name}';`);

        if (fs.existsSync(`${path}/${name}.scss`)) {
            scssLines.push(`@import 'components/${name}/${name}.scss';`);
        }
    });

scssLines.push("@import 'components/Reading.scss';");

// fs.writeFileSync('src/index.ts', indexLines.join('\n') + '\n');
fs.writeFileSync('src/index.scss', scssLines.join('\n') + '\n');
