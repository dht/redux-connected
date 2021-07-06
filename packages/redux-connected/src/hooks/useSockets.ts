import { useCallback, useEffect } from 'react';
import * as sockets from '../sagas/_utils/sockets';

type Json = Record<string, any>;
type Callback = (data: Json) => void;

export function useSockets(eventName: string, callback: Callback) {
    const onMessageReceive = useCallback(
        (data: Json) => {
            callback(data);
        },
        [callback]
    );

    useEffect(() => {
        sockets.on(eventName, onMessageReceive);

        return () => sockets.off(eventName, onMessageReceive);
    }, [onMessageReceive, eventName]);
}
