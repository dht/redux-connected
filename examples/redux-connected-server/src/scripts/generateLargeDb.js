const Chance = require('Chance');
const fs = require('fs-extra');

const PRODUCTS_COUNT = 1000;
const CHATS_COUNT = 10;

const chance = new Chance();

const randomDate = () =>
    chance.date({
        min: new Date(),
        max: new Date('2021-12-31'),
    });

const randomTimestamp = (seconds = 60) =>
    chance.integer({
        min: new Date().getTime() - seconds * 1000,
        max: new Date().getTime(),
    });

const randomInteger = (max = 15) =>
    chance.integer({
        min: 0,
        max: max,
    });

const output = {
    user: {
        firstName: 'James',
        lastName: 'Holden',
        email: 'james.h@gmail.com',
    },
    products: {},
    chats: {},
};

for (let i = 1; i <= PRODUCTS_COUNT; i++) {
    const id = chance.guid();

    output.products[id] = {
        id: id,
        title: `Product #${i}`,
        price: chance.integer({ min: 999, max: 25000 }) / 100,
        thumbnail: chance.avatar() + '?s=64&d=identicon&r=PG',
        imageUrl: chance.avatar() + '?s=500&d=identicon&r=PG',
        color: chance.pickone([
            'green',
            'blue',
            'yellow',
            'purple',
            'gold',
            'red',
            'pink',
            'cyan',
            'orange',
            'brown',
            'gray',
        ]),
        shippingDate: randomDate(),
    };
}

for (let i = 1; i <= CHATS_COUNT; i++) {
    const id = chance.guid();

    const chat = {
        id,
        title: chance.name(),
        items: [],
    };

    output.chats[id] = chat;

    for (let j = 1; i <= randomInteger(15); j++) {
        output.chats[id].items.push({
            id: chance.guid(),
            chatId: chat.id,
            timestamp: randomTimestamp(),
            content: chance.sentence(),
            isMe: chance.bool(),
        });
    }
}

console.log('output ->', output);

fs.writeJSONSync('./src/data/data.json', output, { spaces: 4 });
