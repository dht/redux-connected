import React from 'react';
import TimelineEvent from '../TimelineEvent/TimelineEvent';
import TimelineRowHeader from '../TimelineRowHeader/TimelineRowHeader';
import cssPrefix from '../prefix';
import { IBlock } from '../../redux/initialState';

type TimelineRowProps = {
    block: IBlock;
};

export function TimelineRow(props: TimelineRowProps) {
    const { block } = props;
    const { items = [] } = block;
    const styleBar = {};

    return (
        <div className={`${cssPrefix}TimelineRow-container`}>
            <TimelineRowHeader block={block} />
            <div className="bar" style={styleBar}>
                {items.map((event, index) => (
                    <TimelineEvent key={index} event={event} />
                ))}
            </div>
        </div>
    );
}

export default TimelineRow;
