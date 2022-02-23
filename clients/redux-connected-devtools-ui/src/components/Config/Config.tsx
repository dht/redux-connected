import * as React from 'react';
import Json from '../Json/Json';
import { connectedSelectors } from '@redux-connected';
import { useSelector } from 'react-redux';
import './Config.scss';

interface ConfigProps {}

export function Config(props: ConfigProps) {
    const configs = useSelector(connectedSelectors.$apiRaw).endpointsConfig;

    return (
        <div className="__devtools__Config-container">
            <Json value={configs} />
        </div>
    );
}

export default Config;
