const fs = require('fs-extra');

const PRODUCTS_COUNT = 1000;
const CHATS_COUNT = 10;





const output = {
    user: {
        firstName: 'James',
        lastName: 'Holden',
        email: 'james.h@gmail.com',
    },
    products: [],
    chats: [],
    chats_items: [],
};

for (let i = 1; i <= PRODUCTS_COUNT; i++) {
    output.products.push({
        id: chance.guid(),
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
    });
}

for (let i = 1; i <= CHATS_COUNT; i++) {
    const chat = {
        id: chance.guid(),
        title: chance.name(),
        items: [],
    };

    output.chats.push(chat);

    for (let j = 1; i <= randomInteger(15); j++) {
        output.chats_items.push({
            id: chance.guid(),
            chatId: chat.id,
            timestamp: randomTimestamp(),
            content: chance.sentence(),
            isMe: chance.bool(),
        });
    }
}

fs.writeJSONSync('./data/data.json', output, { spaces: 4 });
