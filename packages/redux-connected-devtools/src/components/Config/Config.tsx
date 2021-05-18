import * as React from 'react';
import classnames from 'classnames';
import Json from '../Json/Json';
import * as selectors from '../../selectors/selectors';
import { useSelector } from 'react-redux';

interface ConfigProps {
    isWide: boolean;
}

export function Config(props: ConfigProps) {
    const { isWide } = props;
    const configs = useSelector(selectors.$endpointsConfig);

    const className = classnames('__devtools__Config-container', {
        wide: isWide,
    });

    return (
        <div className={className}>
            <Json value={configs} />
        </div>
    );
}

export default Config;
