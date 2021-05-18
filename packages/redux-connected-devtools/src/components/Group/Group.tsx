import * as React from 'react';
import classnames from 'classnames';
import cssPrefix from '../prefix';

type GroupProps = {
    title: string;
    isWide?: boolean;
    fluid?: boolean;
    children: JSX.Element;
};

export function Group(props: GroupProps) {
    const { title, isWide, fluid } = props;

    const className = classnames(`${cssPrefix}Group-container`, {
        wide: isWide,
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
