import { EmitterBuilder } from './server';
import Chance from 'chance';

const chance = new Chance();

const mocks = {
    emit: jest.fn(),
    broadcast: jest.fn(),
    game: jest.fn(),
    games: jest.fn(),
    emitIO: jest.fn(),
    emitRoomIO: jest.fn(),
    namespaceIO: jest.fn(),
    namespaceAndRoomIO: jest.fn(),
    recipientIO: jest.fn(),
};

const socket = {
    emit: mocks.emit,
    broadcast: {
        emit: mocks.broadcast,
    },
    to: () => ({
        emit: mocks.game,
        to: () => ({
            emit: mocks.games,
        }),
    }),
};

const io = {
    emit: mocks.emitIO,
    in: () => ({
        emit: mocks.emitRoomIO,
    }),
    of: () => ({
        emit: mocks.namespaceIO,
        to: () => ({
            emit: mocks.namespaceAndRoomIO,
        }),
    }),
    to: () => ({
        emit: mocks.recipientIO,
    }),
};

describe('server EmitterBuilder', () => {
    let emitterBuilder, emitter, eventId, data;

    beforeEach(() => {
        emitterBuilder = new EmitterBuilder();
        eventId = chance.guid();
        data = { key: chance.word() };
    });

    it('sending to the client', () => {
        emitter = emitterBuilder.withIncludeSender(true).build(socket, io);
        emitter.emit(eventId, data);
        expect(mocks.emit).toHaveBeenCalledWith(eventId, data);
    });

    it('sending to all clients except sender', () => {
        emitter = emitterBuilder.build(socket, io);
        emitter.emit(eventId, data);
        expect(mocks.broadcast).toHaveBeenCalledWith(eventId, data);
    });

    it('sending to all clients in "game" room except sender', () => {
        const roomId = 'game';

        emitter = emitterBuilder.withRooms([roomId]).build(socket, io);

        emitter.emit(eventId, data);
        expect(mocks.game).toHaveBeenCalledWith(eventId, data);
    });

    it('sending to all clients in "game1" and/or in "game2" room, except sender', () => {
        const rooms = ['game1', 'game2'];

        emitter = emitterBuilder.withRooms(rooms).build(socket, io);

        emitter.emit(eventId, data);
        expect(mocks.games).toHaveBeenCalledWith(eventId, data);
    });

    it('sending to all clients in "game" room, including sender', () => {
        const roomId = 'game';

        emitter = emitterBuilder
            .withRooms([roomId])
            .withIncludeSender(true)
            .build(socket, io);

        emitter.emit(eventId, data);
        expect(mocks.emitRoomIO).toHaveBeenCalledWith(eventId, data);
    });

    it('sending to all clients in namespace "myNamespace", including sender', () => {
        const namespace = 'myNamespace';

        emitter = emitterBuilder
            .withNameSpace(namespace)
            .withIncludeSender(true)
            .build(socket, io);

        emitter.emit(eventId, data);
        expect(mocks.namespaceIO).toHaveBeenCalledWith(eventId, data);
    });

    it('sending to a specific room in a specific namespace, including sender', () => {
        const namespace = 'myNamespace';
        const roomId = 'game';

        emitter = emitterBuilder
            .withNameSpace(namespace)
            .withRooms([roomId])
            .withIncludeSender(true)
            .build(socket, io);

        emitter.emit(eventId, data);
        expect(mocks.namespaceAndRoomIO).toHaveBeenCalledWith(eventId, data);
    });

    it('sending to individual socketid (private message)', () => {
        const recipientId = chance.guid();

        emitter = emitterBuilder //
            .withRecipientId(recipientId)
            .build(socket, io);

        emitter.emit(eventId, data);
        expect(mocks.recipientIO).toHaveBeenCalledWith(eventId, data);
    });

    it('sending to all connected clients', () => {
        emitter = emitterBuilder //
            .withToAll(true)
            .build(socket, io);

        emitter.emit(eventId, data);
        expect(mocks.emitIO).toHaveBeenCalledWith(eventId, data);
    });
});
