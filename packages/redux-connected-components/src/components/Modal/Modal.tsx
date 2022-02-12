import * as React from 'react';
import classnames from 'classnames';
import { useClickAway, useKey } from 'react-use';
import { useRef } from 'react';
import Button from '../Button/Button';
import cssPrefix from '../prefix';

type Action = {
    id: string;
    text: string;
    isPrimary?: boolean;
    onClick?: () => void;
};

type ModalProps = {
    title: string;
    className?: string;
    actions: Action[];
    children: JSX.Element;
    onClose: () => void;
    isLoading?: boolean;
};

export function Modal(props: ModalProps) {
    const { title, actions, isLoading } = props;
    const ref = useRef(null);

    useClickAway(ref, () => {
        props.onClose();
    });

    useKey('Escape', () => {
        props.onClose();
    });

    const className = classnames('content', props.className);

    function renderAction(action: Action) {
        const { isPrimary } = action;

        return (
            <div className="action" key={action.id}>
                <Button onClick={action.onClick} isPrimary={isPrimary} isLoading={isLoading && isPrimary}>
                    {action.text}
                </Button>
            </div>
        );
    }

    function renderActions() {
        return <div className="actions">{actions.map((action) => renderAction(action))}</div>;
    }

    return (
        <div className={`${cssPrefix}Modal-container`}>
            <div className="overlay">
                <div className="modal" ref={ref}>
                    <div className="header">
                        <div className="title">{title}</div>
                        <div className="close">
                            <span className="material-icons icon" onClick={props.onClose}>
                                close
                            </span>
                        </div>
                    </div>
                    <div className={className}>{props.children}</div>
                    {renderActions()}
                </div>
            </div>
        </div>
    );
}

export default Modal;
