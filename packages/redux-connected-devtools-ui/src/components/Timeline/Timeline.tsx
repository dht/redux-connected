import React from 'react';
import { useSelector } from 'react-redux';
import TimelineRow from '../TimelineRow/TimelineRow';
import cssPrefix from '../prefix';
import './Timeline.scss';
import { connectedSelectors } from '@redux-connected';

type TimelineProps = {
    selector: any;
};

const $i = (i: any) => i;

export function Timeline(props: TimelineProps) {
    console.log('props ->', props);

    const sagas: any = useSelector(connectedSelectors.$sagas);

    console.log('sagas ->', sagas);

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
