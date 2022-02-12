// import { JSON } from '../types/types';
// // import { Callback, Emitter } from 'redux-connected-sockets';
// import { Socket } from 'socket.io';

// const socketChatCallback = (client: Socket, io: any) => {
//     console.log('chat: a user connected');

//     client.on('disconnect', () => {
//         console.log('chat: user disconnected');
//     });

//     client.on('message', (data: JSON, callback?: Callback) => {
//         const emitter = new Emitter(client, io).get({
//             roomId: data.roomId,
//         });

//         emitter.emit('message', data);

//         if (typeof callback === 'function') {
//             callback({ success: true });
//         }
//     });

//     client.on('transient', (data: JSON, callback?: Callback) => {
//         const emitter = new Emitter(client, io).get({
//             roomId: data.roomId,
//         });

//         emitter.emit('transient', data);

//         if (typeof callback === 'function') {
//             callback({ success: true });
//         }
//     });

//     client.on('join', (data: JSON, callback?: Callback) => {
//         const { roomId } = data;

//         if (!roomId) {
//             return;
//         }

//         client.join(roomId);

//         if (typeof callback === 'function') {
//             callback({ success: true });
//         }
//     });

//     client.on('leave', (data: JSON, callback?: Callback) => {
//         const { roomId } = data;

//         if (!roomId) {
//             return;
//         }

//         client.leave(roomId);

//         if (typeof callback === 'function') {
//             callback({ success: true });
//         }
//     });
// };

// export const socketChat = (io: any) => {
//     io.on('connection', (socket: any) => socketChatCallback(socket, io));
// };
