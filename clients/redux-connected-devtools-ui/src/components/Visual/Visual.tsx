import * as React from 'react';
import classnames from 'classnames';
import Group from '../Group/Group';
import { connectedSelectors } from '@redux-connected';
import { useDispatch, useSelector } from 'react-redux';
import { preview } from '../Preview/Preview';
import { ApiRequest, EndpointsConfig } from 'redux-connected-types';
import cssPrefix from '../prefix';
import './Visual.scss';

type VisualProps = {};

export function Visual(props: VisualProps) {
    const dispatch = useDispatch();
    const requests: ApiRequest[] = useSelector(connectedSelectors.$requestsRaw);
    const configs: EndpointsConfig = useSelector(
        connectedSelectors.$apiRaw
    ).endpointsConfig;

    const nodeTypes = useSelector(connectedSelectors.$nodeTypes);

    function onClick(request: ApiRequest) {
        dispatch(preview(request, 'request'));
    }

    function renderRequests(nodeName: string) {
        const requestsForNode = requests.filter(
            (request) => request.nodeName === nodeName
        );

        return requestsForNode.map((request) => {
            const className = classnames('request', request.status);

            return (
                <div
                    key={request.meta.id}
                    className={className}
                    onClick={() => onClick(request)}
                >
                    {request.meta.sequence}
                </div>
            );
        });
    }

    function renderGroup(nodeName: string) {
        const config = configs[nodeName];

        // if (config.connectionType !== ConnectionType.REST) {
        //     return null;
        // }

        return (
            <Group key={nodeName} title={nodeName}>
                <>{renderRequests(nodeName)}</>
            </Group>
        );
    }

    return (
        <div className={`${cssPrefix}Visual-container`}>
            {Object.keys(nodeTypes).map(renderGroup)}
        </div>
    );
}

export default Visual;
