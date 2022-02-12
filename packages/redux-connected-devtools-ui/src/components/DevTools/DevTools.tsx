import * as React from 'react';
import classnames from 'classnames';
import cssPrefix from '../prefix';
import { Grid } from 'igrid';
import { panels } from './panels';
import { widgets } from './widgets';
import './DevTools.scss';

type DevToolsProps = {};

export function DevTools(_props: DevToolsProps) {
    const className = classnames(`${cssPrefix}DevTools-container`, {});

    return (
        <div className={className}>
            <Grid
                showToggle={true}
                id=""
                defaultPanels={panels}
                widgets={widgets}
            />
        </div>
    );
}

export default DevTools;
