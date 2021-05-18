import * as React from 'react';
import classnames from 'classnames';
import Group from '../Group/Group';
import * as selectors from '../../selectors/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { ApiRequest } from 'redux-connected';
import { preview } from '../Preview/Preview';
import { EndpointsConfig, ConnectionType } from 'redux-connected/lib/types/types';
import cssPrefix from '../prefix';

type VisualProps = {
    isWide: boolean;
};

export function Visual(props: VisualProps) {
    const dispatch = useDispatch();
    const requests: ApiRequest[] = useSelector(selectors.$requestsRaw);
    const configs: EndpointsConfig = useSelector(selectors.$endpointsConfig);

    const nodeTypes = useSelector(selectors.$nodeTypes);

    const { isWide } = props;

    function onClick(request: ApiRequest) {
        dispatch(preview(request, 'request'));
    }

    function renderRequests(nodeName: string) {
        const requestsForNode = requests.filter((request) => request.nodeName === nodeName);

        return requestsForNode.map((request) => {
            const className = classnames('request', request.status);

            return (
                <div key={request.meta.id} className={className} onClick={() => onClick(request)}>
                    {request.meta.sequence}
                </div>
            );
        });
    }

    function renderGroup(nodeName: string) {
        const config = configs[nodeName];

        if (config.connectionType !== ConnectionType.REST) {
            return null;
        }

        return (
            <Group key={nodeName} title={nodeName} isWide={isWide}>
                <>{renderRequests(nodeName)}</>
            </Group>
        );
    }

    const className = classnames(`${cssPrefix}Visual-container`, {
        wide: isWide,
    });

    return <div className={className}>{Object.keys(nodeTypes).map(renderGroup)}</div>;
}

export default Visual;
