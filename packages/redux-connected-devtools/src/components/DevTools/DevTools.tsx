import * as React from 'react';
import classnames from 'classnames';
import cssPrefix from '../prefix';
import { Grid } from 'igrid';
import { panels } from '../../data/panels';
import { Provider } from 'react-redux';
import { widgets } from '../../data/widgets';
import './DevTools.scss';
import { useRemoteStore } from '../../hooks/useRemoteStore';

type DevToolsProps = {};

export function DevTools(_props: DevToolsProps) {
    const [store] = useRemoteStore('http://10.100.102.26:4000', 'connectedStore');
    const className = classnames(`${cssPrefix}DevTools-container`, {});

    if (!store) {
        return null;
    }

    return (
        <div className={className}>
            <Provider store={store}>
                <Grid defaultPanels={panels} widgets={widgets} />
            </Provider>
        </div>
    );
}

export default DevTools;
