import React from 'react';
import { IBlock } from '../../redux/initialState';
import cssPrefix from '../prefix';

type TimelineRowHeaderProps = {
    block: IBlock;
};

export function TimelineRowHeader(props: TimelineRowHeaderProps) {
    const { block } = props;
    return (
        <div className={`${cssPrefix}TimelineRowHeader-container`}>
            <div className="name">{block.id}</div>
            <div className="icons">{/* <span className="icon material-icons-outlined">loop</span> */}</div>
        </div>
    );
}

export default TimelineRowHeader;
