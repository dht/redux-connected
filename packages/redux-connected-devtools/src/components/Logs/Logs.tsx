import * as React from 'react';
import { Action } from 'redux-store-generator';
import { useMonitor, Reading, clearMeta } from 'redux-connected';
import VirtualList, { VirtualListItemWithEvent, VirtualListRowProps } from '../VirtualList/VirtualList';
import classnames from 'classnames';
import { useDispatch } from 'react-redux';
import { preview } from '../Preview/Preview';
import { Log } from 'redux-connected';
import cssPrefix from '../prefix';

type LogsProps = {
    isWide: boolean;
};

const now = new Date().getTime();

export function Logs(props: LogsProps) {
    const dispatch = useDispatch();
    const [readings] = useMonitor({}, (action: Action) => action.type === 'LOG');

    function onClick(reading: Reading) {
        const { action } = reading;
        const log = action.payload as Log;
        dispatch(preview(log, 'log'));
    }

    const { isWide } = props;

    const className = classnames(`${cssPrefix}Logs-container`, `${cssPrefix}Rows-container`, {
        wide: isWide,
    });

    const height = isWide ? 735 : 395;

    return (
        <div className={className}>
            <VirtualList className={className} items={readings} height={height} onClick={onClick}>
                {LowRow}
            </VirtualList>
        </div>
    );
}

const LowRow = (props: VirtualListRowProps) => {
    const { index } = props;
    const listItem: VirtualListItemWithEvent<Reading> = props.data[index];
    const reading = listItem.item;
    const { action } = reading;
    const { payload } = action;
    const { meta, message } = payload || {};
    const { shortId, createdTS, sequence } = meta;

    const className = classnames(`${cssPrefix}Reading-container`, {});

    const delta = ((createdTS - now) / 1000).toFixed(2);

    const data = clearMeta(payload || {});
    delete data['message'];

    return (
        <div className={className} style={props.style} onClick={listItem.onClick}>
            <div className="col">
                <div className="row">
                    <div className="sequence">{sequence}</div>
                    <div className="message">{message}</div>
                </div>
                <div className="description">{JSON.stringify(data)}</div>
            </div>
            <div className="col">
                <div className="timestamp">+{delta}</div>
                <div className="id">{shortId}</div>
            </div>
        </div>
    );
};

export default Logs;
