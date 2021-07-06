import React from 'react';
import { ISaga } from '../../types';
import cssPrefix from '../prefix';

type TimelineRowHeaderProps = {
    saga: ISaga;
};

export function TimelineRowHeader(props: TimelineRowHeaderProps) {
    const { saga } = props;
    return (
        <div className={`${cssPrefix}TimelineRowHeader-container`}>
            <div className="name">{saga.id}</div>
            <div className="icons">
                <span className="icon material-icons-outlined">loop</span>
            </div>
        </div>
    );
}

export default TimelineRowHeader;
