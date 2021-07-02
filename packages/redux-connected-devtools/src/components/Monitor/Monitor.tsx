import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sagas, SagaState } from 'redux-connected';
import { formatDistance } from 'date-fns';
import { startSaga, stopSaga } from 'redux-connected';
import classnames from 'classnames';
import VirtualList, { VirtualListItemWithEvent, VirtualListRowProps } from '../VirtualList/VirtualList';
import * as selectors from '../../selectors/selectors';
import { preview } from '../Preview/Preview';
import cssPrefix from '../prefix';
import Toggle from '../Toggle/Toggle';

type MonitorProps = {
    isWide: boolean;
};

export function Monitor(props: MonitorProps) {
    const dispatch = useDispatch();
    const { isWide } = props;
    const sagas = useSelector(selectors.$sagas);

    function onClick(item: SagaState) {
        dispatch(preview(item, 'process'));
    }

    const className = classnames(`${cssPrefix}Monitor-container`, `${cssPrefix}Rows-container`, {
        wide: isWide,
    });

    const height = isWide ? 735 : 325;

    return (
        <VirtualList className={className} items={sagas} height={height} onClick={onClick}>
            {SagaRow}
        </VirtualList>
    );
}

const SagaRow = (props: VirtualListRowProps) => {
    const dispatch = useDispatch();

    const { index } = props;
    const listItem: VirtualListItemWithEvent<SagaState> = props.data[index];

    const saga = listItem.item;

    const distanceStart = formatDistance(new Date(), new Date(saga.startedTS || 0));

    const distanceStopped = formatDistance(new Date(), new Date(saga.stoppedTS || 0));

    const distance = saga.isRunning ? distanceStart : distanceStopped;

    function onChange(_ev: React.MouseEvent<HTMLElement>, checked?: boolean) {
        const sagaId = saga.id as keyof Sagas;

        const action = checked ? startSaga({ sagaId }) : stopSaga({ sagaId });

        dispatch(action);
    }

    const className = classnames(`${cssPrefix}Reading-container`, {
        disabled: !saga.isRunning,
    });

    return (
        <div className={className} key={saga.id} style={props.style} onClick={listItem.onClick}>
            <div className="col">
                <div className="title">
                    {saga.id} <span className="timeAgo">{distance} ago</span>
                </div>
                <div className="description" title={saga.description}>
                    {saga.description}
                </div>
            </div>
            <div className="col">
                <Toggle defaultChecked={saga.isRunning} onChange={onChange} />
            </div>
        </div>
    );
};

export default Monitor;
