import React from 'react';
import { ISaga } from '../../types';
import TimelineEvent from '../TimelineEvent/TimelineEvent';
import TimelineRowHeader from '../TimelineRowHeader/TimelineRowHeader';
import cssPrefix from '../prefix';
import './TimelineRow.scss';

type TimelineRowProps = {
    saga: ISaga;
};

export function TimelineRow(props: TimelineRowProps) {
    const { saga } = props;
    const { items = [] } = saga;
    const styleBar = {};

    return (
        <div className={`${cssPrefix}TimelineRow-container`}>
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
