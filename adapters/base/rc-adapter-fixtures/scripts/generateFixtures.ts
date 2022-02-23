// import { generateCollection } from './../src/utils/generateFixtures';
// const fs = require('fs-extra');

// const writeTs = (filepath, variableName, data) =>
//     fs.writeFileSync(
//         filepath,
//         `export const ${variableName} = ${JSON.stringify(data, null, 4)};\n`
//     );

// const writeCollection = (name, productsCount, logsCount, chatsCount) => {
//     const result = generateCollection(productsCount, logsCount, chatsCount);
//     fs.mkdirSync(`./src/${name}`, { recursive: true });
//     writeTs(`./src/${name}/user.ts`, 'user', result.data.user);
//     writeTs(`./src/${name}/products.ts`, 'products', result.data.products);
//     writeTs(`./src/${name}/logs.ts`, 'logs', result.data.logs);
//     writeTs(`./src/${name}/chats.ts`, 'chats', result.data.chats);
//     writeTs(`./src/${name}/chatItems.ts`, 'chatItems', result.data.chatItems);

//     fs.writeFileSync(`./src/${name}/index.ts`, result.index);

//     return `import _${name} from './${name}';
// export const ${name} = _${name}\n`;
// };

// let mainIndex = '';
// mainIndex += writeCollection('small', 10, 10, 10);
// mainIndex += writeCollection('medium', 50, 50, 50);
// mainIndex += writeCollection('large', 1000, 1000, 1000);
// fs.writeFileSync('./src/index.ts', mainIndex);
