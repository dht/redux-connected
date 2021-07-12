import React from 'react';
import { useSelector } from 'react-redux';
import TimelineRow from '../TimelineRow/TimelineRow';
import cssPrefix from '../prefix';

type TimelineProps = {
    selector: any;
};

const $i = (i: any) => i;

export function Timeline(props: TimelineProps) {
    const sagas: any = useSelector(props.selector || $i);

    if (!Array.isArray(sagas)) {
        return null;
    }

    return (
        <div className={`${cssPrefix}Timeline-container`}>
            {sagas.map((saga) => (
                <TimelineRow key={saga.id} saga={saga} />
            ))}
        </div>
    );
}

export default Timeline;