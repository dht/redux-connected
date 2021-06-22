import React, { useState } from 'react';
import Grid from '../Grid/Grid';
import './App.scss';
import { panels } from '../../data/panels';
import { WidgetGallery } from '../WidgetGallery/WidgetGallery';
import { Widget } from '../../types.specific';

function App() {
    const [widgetId, setWidgetId] = useState<string>();

    const panelToFit = panels[widgetId];

    function renderGallery() {
        return <WidgetGallery widgets={panels} onSelect={setWidgetId} />;
    }

    function renderPanel(id: string) {
        return <div className="panel">this is a panel</div>;
    }

    return (
        <div className="App-container">
            <Grid
                panels={panels}
                panelToFit={panelToFit}
                renderGallery={renderGallery}
                renderPanel={renderPanel}
            />
        </div>
    );
}

export default App;
