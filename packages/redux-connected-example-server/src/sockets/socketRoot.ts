import { socketRefresh } from './socketRefresh';
import { socketChat } from './socketChat';
import { socketPing } from './socketPing';

export const socketRoot = (io: any) => {
    socketPing(io);
    socketRefresh(io.of('/$refresh'));
    socketChat(io.of('/chats'));
};
