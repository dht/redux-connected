import * as React from 'react';
import classnames from 'classnames';
import cssPrefix from '../prefix';
import './Group.scss';

type GroupProps = {
    title: string;
    fluid?: boolean;
    children: JSX.Element;
};

export function Group(props: GroupProps) {
    const { title, fluid } = props;

    const className = classnames(`${cssPrefix}Group-container`, {
        fluid,
    });

    return (
        <div className={className}>
            <div className="title">{title}</div>
            <div className="items">{props.children}</div>
        </div>
    );
}

export default Group;
