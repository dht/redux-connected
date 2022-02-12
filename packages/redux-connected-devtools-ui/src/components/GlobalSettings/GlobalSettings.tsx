import * as React from 'react';
import Json from '../Json/Json';
import { connectedSelectors } from '@redux-connected';
import { useSelector } from 'react-redux';
import cssPrefix from '../prefix';
import './GlobalSettings.scss';

type GlobalSettingsProps = {};

export function GlobalSettings(props: GlobalSettingsProps) {
    const settingsAndStats = useSelector(connectedSelectors.$settingsAndStats);

    return (
        <div className={`${cssPrefix}GlobalSettings-container`}>
            <Json value={settingsAndStats} />
        </div>
    );
}

export default GlobalSettings;
