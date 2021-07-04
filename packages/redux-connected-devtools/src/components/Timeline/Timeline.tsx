import React from 'react';
import { useSelector } from 'react-redux';
import TimelineHeader from '../TimelineHeader/TimelineHeader';
import TimelineRow from '../TimelineRow/TimelineRow';

type TimelineProps = {
    selector: any;
};

const $i = (i) => i;

export function Timeline(props: TimelineProps) {
    const sagas: any = useSelector(props.selector || $i);

    if (!Array.isArray(sagas)) {
        return null;
    }

    return (
        <div className="Timeline-container">
            <div className="header">
                <TimelineHeader />
            </div>
            {sagas.map((saga) => (
                <TimelineRow key={saga.id} saga={saga} />
            ))}
        </div>
    );
}

export default Timeline;
