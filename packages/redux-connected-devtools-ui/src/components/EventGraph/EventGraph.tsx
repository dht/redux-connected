import React from 'react';
import './EventGraph.scss';
import classnames from 'classnames';
import cssPrefix from '../prefix';
import { Grid } from 'igrid';
import { panels } from './panels';
import { widgets } from './widgets';

type EventGraphProps = {};

export function EventGraph(props: EventGraphProps) {
    const className = classnames(`${cssPrefix}EventGraph-container`, {});

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

export default EventGraph;
