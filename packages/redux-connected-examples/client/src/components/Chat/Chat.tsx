import './Chat.scss';
import * as sockets from '../../utils/sockets';
import { useMount } from 'react-use';
import ReleaseButton from '../ReleaseButton/ReleaseButton';
import { useRef } from 'react';

type ChatProps = {};

export function Chat(props: ChatProps) {
    const ref = useRef<HTMLInputElement>(null);

    const roomId = 12;

    useMount(() => {
        // sockets.listen('message', (data: any) => {
        //     console.log('incoming data ->', data);
        // });
        // sockets.emit('join', { roomId }, (answer: any) => {
        //     console.log('join answer ->', answer);
        // });
    });

    function onChange(isDown: boolean) {
        // sockets.emit('transient', { roomId, isDown }, (answer: any) => {
        //     console.log('transient answer ->', answer);
        // });
    }

    function send() {
        const content = ref.current?.value;

        // sockets.emit('message', { content, roomId }, (answer: any) => {
        //     console.log('message answer ->', answer);
        // });
    }

    return (
        <div className="Chat-container">
            <ReleaseButton onChange={onChange}>is typing</ReleaseButton>
            <input type="text" ref={ref} defaultValue="my message"></input>
            <button onClick={send}>Send</button>
        </div>
    );
}

export default Chat;
