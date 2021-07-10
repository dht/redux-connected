import React from 'react';
import classnames from 'classnames';
import cssPrefix from '../prefix';
import { IBlockEvent } from '../../redux/initialState';
import { useDispatch } from 'react-redux';
import { preview } from '../Preview/Preview';

type TimelineEventProps = {
    event: IBlockEvent;
};

export function TimelineEvent(props: TimelineEventProps) {
    const dispatch = useDispatch();

    const { event } = props;
    const { counter } = event;

    const className = classnames(`${cssPrefix}TimelineEvent-container`);

    const onClick = () => {
        dispatch(
            preview(
                {
                    meta: {
                        id: '1',
                        shortId: '1',
                        createdTS: 0,
                        sequence: 1,
                    },
                    event,
                },
                'log',
            ),
        );
    };

    return (
        <div className={className} onClick={onClick}>
            {counter}
        </div>
    );
}

export default TimelineEvent;
