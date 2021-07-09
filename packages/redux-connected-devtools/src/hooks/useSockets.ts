import { useMount } from 'react-use';
import { useEffect } from 'react';
import * as sockets from '../utils/sockets';

type Callback = (data: any) => void;

export function useSockets(url: string, eventName: string, callback: Callback, dependencies: any[] = []) {
    useMount(() => {
        sockets.initSockets(url);
    });

    useEffect(() => {
        sockets.on(eventName, callback);

        return () => sockets.off(eventName, callback);
    }, [eventName, ...dependencies]);
}
