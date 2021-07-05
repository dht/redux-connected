import * as React from 'react';
import { Grid } from 'igrid';
import { panels } from '../../data/panelsLocal';
import { widgets } from '../../data/widgetsLocal';
import cssPrefix from '../prefix';
import classnames from 'classnames';

type DevToolsLocalProps = {};

export function DevToolsLocal(_props: DevToolsLocalProps) {
    const className = classnames(`${cssPrefix}DevToolsLocal-container`, {});

    return (
        <div className={className}>
            <Grid defaultPanels={panels} widgets={widgets} />
        </div>
    );
}

export default DevToolsLocal;
