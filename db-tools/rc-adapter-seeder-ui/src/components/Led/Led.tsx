import React from 'react';
import classnames from 'classnames';
import './Led.scss';

type LedProps = {
    on: boolean;
};

export function Led(props: LedProps) {
    const { on } = props;
    const className = classnames('Led-container', { on });

    return <div className={className}></div>;
}

export default Led;
