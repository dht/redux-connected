import React from 'react';
import { ISaga } from '../../types';
import TimelineEvent from '../TimelineEvent/TimelineEvent';
import TimelineRowHeader from '../TimelineRowHeader/TimelineRowHeader';

type TimelineRowProps = {
    saga: ISaga;
};

export function TimelineRow(props: TimelineRowProps) {
    const { saga } = props;
    const { items = [] } = saga;
    const styleBar = {};

    return (
        <div className="TimelineRow-container">
            <TimelineRowHeader saga={saga} />
            <div className="bar" style={styleBar}>
                {items.map((event, index) => (
                    <TimelineEvent key={index} event={event} />
                ))}
            </div>
        </div>
    );
}

export default TimelineRow;
