import { format, addDays } from 'date-fns';

const Chance = require('Chance');
const chance = new Chance();

export const randomGuid = () => chance.guid();

export const randomDate = () => {
    const date = chance.date({
        min: new Date(),
        max: new Date('2021-12-31'),
    });

    return format(date, 'yyyy-MM-dd');
};

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

export const randomUser = (id: string | null) => {
    const user: any = {
        name: chance.name(),
        email: chance.email(),
    };

    if (id) {
        user.id = id;
    }

    return user;
};

export const randomProduct = (id: string | null, i: number) => {
    const product: any = {
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
    };

    if (!id) {
        delete product['id'];
    }

    return product;
};

export const randomChatMessage = (id: string | null) => {
    const chatMessage: any = {
        id,
        timestamp: randomTimestamp(),
        content: chance.sentence(),
        isMe: chance.bool(),
    };

    if (!id) {
        delete chatMessage['id'];
    }

    return chatMessage;
};

export const randomChat = (id: string | null) => {
    const chat: any = {
        id,
        title: chance.name(),
    };

    if (!id) {
        delete chat['id'];
    }

    return chat;
};

export const randomLog = (id: string | null, timestamp = randomTimestamp()) => {
    const log: any = {
        id,
        title: chance.name(),
        timestamp,
    };

    if (!id) {
        delete log['id'];
    }

    return log;
};

export const dropIds = (array: any[]) =>
    array.map((item) => {
        delete item['id'];
        return item;
    });

export const generateDateArray = (startDate: Date, size: number) => {
    const output: string[] = [];

    for (let i = 0; i < size; i++) {
        const date = addDays(startDate, i);
        output.push(format(date, 'yyyy-MM-dd'));
    }

    return output;
};

export const pickRandom = (array: string[]) => {
    const rnd = Math.floor(Math.random() * array.length);
    return array.splice(rnd, 1);
};
