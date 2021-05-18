const Chance = require('Chance');

const chance = new Chance();

export const randomGuid = () => chance.guid();

export const randomDate = () =>
    chance.date({
        min: new Date(),
        max: new Date('2021-12-31'),
    });

export const randomTimestamp = (seconds = 60) =>
    chance.integer({
        min: new Date().getTime() - seconds * 1000,
        max: new Date().getTime(),
    });

export const randomInteger = (max = 15) =>
    chance.integer({
        min: 0,
        max: max,
    });

export const randomUser = (id: string) => ({
    id,
    name: chance.name(),
    email: chance.email(),
});

export const randomProduct = (id: string, i: number) => ({
    id,
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

export const randomChat = (id: string) => {
    const chat: any = {
        id,
        title: chance.name(),
        items: [],
    };

    for (let j = 1; j <= randomInteger(15); j++) {
        const message = {
            id: chance.guid(),
            chatId: chat.id,
            timestamp: randomTimestamp(),
            content: chance.sentence(),
            isMe: chance.bool(),
        };

        chat.items.push(message);
    }

    return chat;
};

export const randomLog = (id: string) => {
    const log: any = {
        id,
        title: chance.name(),
        timestamp: randomTimestamp(),
    };

    return log;
};
