import * as React from 'react';
import { ApiRequest } from 'redux-connected';
import VirtualList, { VirtualListItemWithEvent, VirtualListRowProps } from '../VirtualList/VirtualList';
import classnames from 'classnames';
import * as selectors from '../../selectors/selectors';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { preview } from '../Preview/Preview';
import { ApiRequestStatus } from 'redux-connected/lib/types/types';
import cssPrefix from '../prefix';

type RequestsProps = {
    isWide: boolean;
};

const now = new Date().getTime();

export function Requests(props: RequestsProps) {
    const dispatch = useDispatch();
    const requests = useSelector(selectors.$requestsRaw);
    const { isWide } = props;

    function onClick(request: ApiRequest) {
        dispatch(preview(request, 'request'));
    }

    const className = classnames(`${cssPrefix}Logs-container`, `${cssPrefix}Rows-container`, {
        wide: isWide,
    });

    const height = isWide ? 735 : 395;

    return (
        <div className={`${cssPrefix}Requests-container`}>
            <VirtualList className={className} items={requests} height={height} onClick={onClick}>
                {RequestRow}
            </VirtualList>
        </div>
    );
}

const RequestRow = (props: VirtualListRowProps) => {
    const { index } = props;
    const listItem: VirtualListItemWithEvent<ApiRequest> = props.data[index];
    const apiRequest = listItem.item;
    const { meta, method, path, params, status, errorType, errorStatus } = apiRequest;

    const { createdTS, id, shortId, sequence } = meta;

    const className = classnames(`${cssPrefix}Reading-container`, {});

    const delta = ((createdTS - now) / 1000).toFixed(2);

    function renderStatus() {
        let text;

        const isError = status === ApiRequestStatus.ERROR;

        if (isError) {
            text = `${status} (${errorType} ${errorStatus})`;
        } else {
            text = status;
        }

        const className = classnames('status', { error: isError });

        return <span className={className}>{text}</span>;
    }

    return (
        <div className={className} style={props.style} onClick={listItem.onClick} key={id}>
            <div className="col">
                <div className="row">
                    <div className="sequence">{sequence}</div>
                    <div className="badge">{method}</div>
                    <div className="path" title={path}>
                        {path}
                    </div>
                </div>
                <div className="description">
                    {renderStatus()}
                    {isEmpty(params) ? '' : JSON.stringify(params)}
                </div>
            </div>
            <div className="col">
                <div className="timestamp">+{delta}s</div>
                <div className="id">{shortId}</div>
            </div>
        </div>
    );
};

export default Requests;
