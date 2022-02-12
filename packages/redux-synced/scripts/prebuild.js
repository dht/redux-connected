const fs = require('fs');
const packageRaw = fs.readFileSync('./package.json').toString();
const packageJson = JSON.parse(packageRaw);

fs.writeFileSync(
    './src/data/version.ts',
    `export default {
    version: '${packageJson.version}',
};
`
);
