import * as React from 'react';
import classnames from 'classnames';
import Json from '../Json/Json';
import * as selectors from '../../selectors/selectors';
import { useSelector } from 'react-redux';
import cssPrefix from '../prefix';

type GlobalSettingsProps = {
    isWide: boolean;
};

export function GlobalSettings(props: GlobalSettingsProps) {
    const { isWide } = props;
    const settingsAndStats = useSelector(selectors.$settingsAndStats);

    const className = classnames(`${cssPrefix}GlobalSettings-container`, {
        wide: isWide,
    });

    return (
        <div className={className}>
            <Json value={settingsAndStats} />
        </div>
    );
}

export default GlobalSettings;
