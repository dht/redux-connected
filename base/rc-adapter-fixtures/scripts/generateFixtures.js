const faker = require('faker');
const fs = require('fs-extra');

const userMap = {
    firstName: 'name.firstName',
    lastName: 'name.lastName',
    username: 'internet.userName',
    email: 'internet.email',
    phone: 'phone.phoneNumber',
    avatar: 'image.avatar',
};

const logMap = {
    id: 'datatype.uuid',
    date: 'date.past',
    priority: 'datatype.number',
};

const productMap = {
    id: 'datatype.uuid',
    dateAdded: 'date.past',
    price: 'commerce.price',
    department: 'commerce.department',
    color: 'commerce.color',
    name: 'commerce.productName',
    description: 'commerce.productDescription',
    imageUrl: 'image.imageUrl',
};

function interpolate(dataPath) {
    return faker.fake(`{{${dataPath}}}`);
}

function generateFromMap(map) {
    return Object.keys(map).reduce((output, fieldName) => {
        output[fieldName] = interpolate(map[fieldName]);
        return output;
    }, {});
}

const generateUser = () => generateFromMap(userMap);
const generateLog = () => generateFromMap(logMap);
const generateProduct = () => generateFromMap(productMap);

const generateLogs = (number) =>
    [...new Array(number)].map((i) => generateLog());
const generateProducts = (number) =>
    [...new Array(number)].map((i) => generateProduct());

const user = generateUser();
const logs = generateLogs(100);
const products = generateProducts(200);

fs.writeFileSync(
    './src/user.js',
    `export const user = ${JSON.stringify(user, null, 4)};\n`
);

fs.writeFileSync(
    './src/logs.js',
    `export const logs = ${JSON.stringify(logs, null, 4)};\n`
);

fs.writeFileSync(
    './src/products.js',
    `export const products = ${JSON.stringify(products, null, 4)};\n`
);
