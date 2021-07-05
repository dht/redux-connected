import * as React from 'react';
import { Grid } from 'igrid';
import { panels } from '../../data/panels';
import { widgets } from '../../data/widgets';
import cssPrefix from '../prefix';
import classnames from 'classnames';
import * as sockets from '../../utils/sockets';
import { useMount } from 'react-use';

type DevToolsProps = {};

export function DevTools(_props: DevToolsProps) {
    const className = classnames(`${cssPrefix}DevTools-container`, {});

    useMount(() => {
        sockets.on('devtools', (data: any) => {
            console.log('data ->', data);
        });
    });

    return (
        <div className={className}>
            <Grid defaultPanels={panels} widgets={widgets} />
        </div>
    );
}

export default DevTools;
