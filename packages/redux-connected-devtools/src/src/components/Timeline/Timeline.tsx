import React from 'react';
import { useSelector } from 'react-redux';
import TimelineRow from '../TimelineRow/TimelineRow';
import cssPrefix from '../prefix';
import { $timeline } from '../../selectors/selectors';

type TimelineProps = {
    selector: any;
};

export function Timeline(props: TimelineProps) {
    const timeline: any = useSelector($timeline);

    if (!Array.isArray(timeline)) {
        return null;
    }

    return (
        <div className={`${cssPrefix}Timeline-container`}>
            {timeline.map((block) => (
                <TimelineRow key={block.id} block={block} />
            ))}
        </div>
    );
}

export default Timeline;
