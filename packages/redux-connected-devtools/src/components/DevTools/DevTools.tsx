import * as React from 'react';
import { Grid, IPanel } from 'igrid';
import { panels } from '../../data/panels';
import { widgets } from '../../data/widgets';
import cssPrefix from '../prefix';
import classnames from 'classnames';

type DevToolsProps = {};

export function DevTools(_props: DevToolsProps) {
    function renderPanel(panel: IPanel) {
        const widget = widgets[panel.widgetId || ''];

        if (!widget || !widget.component) {
            return <div />;
        }

        return widget.component(widget.props);
    }

    function renderInfo(_panel: IPanel) {
        return (
            <div className="panel">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean emper congue. Mauris eget congue magna.
                Aliquam aliquam lorem lectus, eget auctor nisl fringilla eu. Donec semper tincidunt nibh, a hendrerit
                neque posuere in. Ut a augue libero.
            </div>
        );
    }

    const className = classnames(`${cssPrefix}DevTools-container`, {});

    return (
        <div className={className}>
            <Grid defaultPanels={panels} renderPanel={renderPanel} renderInfo={renderInfo} widgets={widgets}></Grid>
        </div>
    );
}

export default DevTools;
