import { io } from 'socket.io-client';

let socket: any;

type Callback = (data: any) => void;

export function connect(url: string) {
    // socket = io(url);
}

export function listen(eventId: string, callback: any) {
    // socket.on(eventId, callback);
}

export function emit(eventId: string, data: any, callback?: Callback) {
    // socket.emit(eventId, data, callback);
}

// connect('ws://localhost:3001/chats');

// const socket = io("ws://example.com/my-namespace")
