import { eventChannel } from 'redux-saga';

export function intervalChannel(duration: number) {
    return eventChannel((emitter) => {
        const interval = setInterval(() => {
            emitter(true);
        }, duration);
        return () => {
            clearInterval(interval);
        };
    });
}
