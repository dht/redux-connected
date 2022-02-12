import React from 'react';
import classnames from 'classnames';
import { IEvent } from '../../types';
import cssPrefix from '../prefix';
import './TimelineEvent.scss';

type TimelineEventProps = {
    event: IEvent;
};

export function TimelineEvent(props: TimelineEventProps) {
    const { event } = props;
    const { timestamp, action } = event;

    const style = {
        left: (timestamp / 1000) * 100 + 'px',
    };

    const className = classnames(
        `${cssPrefix}TimelineEvent-container`,
        action.type
    );

    return <div className={className} style={style}></div>;
}

export default TimelineEvent;
