import * as React from 'react';
import { Grid } from 'igrid';
import { panels } from '../../data/panels';
import { widgets } from '../../data/widgets';

type DevToolsProps = {};

export function DevTools(_props: DevToolsProps) {
    function renderPanel(id: string) {
        const widget = widgets[id];

        if (!widget || !widget.component) {
            return <div />;
        }

        return <div className="panel">{widget.component}</div>;
    }

    function renderInfo(_id: string) {
        return (
            <div className="panel">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean emper congue. Mauris eget congue magna.
                Aliquam aliquam lorem lectus, eget auctor nisl fringilla eu. Donec semper tincidunt nibh, a hendrerit
                neque posuere in. Ut a augue libero.
            </div>
        );
    }

    return (
        <div className="ExamplePick-container">
            <Grid defaultPanels={panels} renderPanel={renderPanel} renderInfo={renderInfo} widgets={widgets}></Grid>
        </div>
    );
}

export default DevTools;
