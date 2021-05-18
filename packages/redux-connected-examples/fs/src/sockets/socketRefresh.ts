import { JSON } from '../types/types';
import { Emitter } from 'redux-connected-sockets';

const socketRefreshCallback = (socket: any, io: any) => {
    const emitter = new Emitter(socket, io).get();

    console.log('Refresh: a user connected');

    socket.on('disconnect', () => {
        console.log('Refresh: user disconnected');
    });

    socket.on('Refresh message', (data: JSON) => {
        emitter.emit('Refresh message', data);
    });
};

export const socketRefresh = (io: any) => {
    io.on('connection', (socket: any) => socketRefreshCallback(socket, io));
};
