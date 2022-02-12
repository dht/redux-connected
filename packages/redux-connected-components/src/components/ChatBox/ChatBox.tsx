import * as React from 'react';
import classnames from 'classnames';
import { Chat, Message } from '../../types/types';
import cssPrefix from '../prefix';

type ChatProps = {
    chat: Chat;
    onClose: () => void;
};

export function ChatBox(props: ChatProps) {
    const { chat } = props;

    return (
        <ChatWindow chat={chat} onClose={props.onClose}>
            <>
                <ChatContent chat={chat} />
                <ChatInput />
            </>
        </ChatWindow>
    );
}

function ChatInput() {
    return (
        <div className="ChatInput-container">
            <input type="text" placeholder="type message..."></input>
            <div className="send">
                <span className="material-icons">send</span>
            </div>
        </div>
    );
}

type ChatContentProps = {
    chat: Chat;
};

function ChatContent(props: ChatContentProps) {
    const { chat } = props;
    const { items = [] } = chat;

    return (
        <div className="ChatContent-container">
            {items.map((message) => (
                <ChatMessage key={message.id} message={message} />
            ))}
        </div>
    );
}

type ChatWindowProps = {
    chat: Chat;
    children: JSX.Element;
    onClose: () => void;
};

function ChatWindow(props: ChatWindowProps) {
    const { chat } = props;
    const { title } = chat;

    return (
        <div className={`${cssPrefix}ChatWindow-container`}>
            <div className="header">
                <div className="title">{title}</div>
                <div className="x" onClick={props.onClose}>
                    <span className="material-icons">close</span>
                </div>
            </div>
            {props.children}
        </div>
    );
}

type ChatMessageProps = {
    message: Message;
};

function ChatMessage(props: ChatMessageProps) {
    const { message } = props;

    const className = classnames('ChatMessage-container', {
        left: !message.isMe,
        right: message.isMe,
    });

    return <div className={className}>message</div>;
}

export default ChatBox;
