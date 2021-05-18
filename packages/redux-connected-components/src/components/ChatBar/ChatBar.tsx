import * as React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMount } from 'react-use';
import { Chats, Message } from '../../types/types';
import ChatBox from '../ChatBox/ChatBox';
import cssPrefix from '../prefix';

type ChatsProps = {
    action: any;
};

const messages: Message[] = [
    {
        id: '1',
        content: "hi, what's up?",
        timestamp: new Date().getTime() - 10,
        isMe: false,
    },
    {
        id: '2',
        content: 'yo!',
        timestamp: new Date().getTime(),
        isMe: true,
    },
];

const chats: Chats = {
    '1': {
        id: '1',
        title: 'Chat #1',
        items: messages,
    },
    '2': {
        id: '2',
        title: 'Chat #2',
        items: messages,
    },
    '3': {
        id: '3',
        title: 'Chat #3',
        items: messages,
    },
};

export function ChatBar(props: ChatsProps) {
    const { action } = props;
    const dispatch = useDispatch();
    const [visible, setVisible] = useState<Record<string, boolean>>({});

    useMount(() => {
        console.log('action({}) ->', action({}));
        dispatch(action({}));
    });

    function toggleVisible(id: string) {
        setVisible({
            [id]: !visible[id],
        });
    }

    function renderChat(chat: any) {
        const { id, title, badge } = chat;

        return (
            <div className="chat" key={id}>
                <div className="button" onClick={() => toggleVisible(id)}>
                    <div className="title">{title}</div>
                    {badge && <div className="badge">{badge}</div>}
                    <div className="online"></div>
                </div>
                {visible[id] && (
                    <div className="window">
                        <ChatBox chat={chat} onClose={() => toggleVisible(id)} />
                    </div>
                )}
            </div>
        );
    }

    function renderChatBar() {
        return Object.values(chats).map((chat) => renderChat(chat));
    }

    return <div className={`${cssPrefix}ChatBar-container`}>{renderChatBar()}</div>;
}

export default ChatBar;
