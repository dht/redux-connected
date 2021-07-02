import React from 'react';
import { IWidget } from 'igrid';
import { boxSizes } from './boxSizes';
import Monitor from '../components/Monitor/Monitor';
import Requests from '../components/Requests/Requests';
import Redux from '../components/Redux/Redux';
import Config from '../components/Config/Config';
import Status from '../components/Status/Status';
import Preview from '../components/Preview/Preview';
import Logs from '../components/Logs/Logs';
import Visual from '../components/Visual/Visual';
import GlobalSettings from '../components/GlobalSettings/GlobalSettings';

export const widgets: Record<string, IWidget> = {
    processes: {
        id: 'processes',
        widgetId: 'processes',
        title: 'Processes',
        description: 'Start & stop processes',
        dimension: boxSizes[0],
        component: <Monitor isWide={false} />,
    },
    requests: {
        id: 'requests',
        widgetId: 'requests',
        title: 'Requests',
        description: 'Monitor API requests',
        dimension: boxSizes[0],
        component: <Requests isWide={false} />,
    },
    redux: {
        id: 'redux',
        widgetId: 'redux',
        title: 'Redux devtools',
        description: 'Watch actions and state changes',
        dimension: boxSizes[1],
        component: <Redux isWide={true} />,
    },
    endpoints: {
        id: 'endpoints',
        widgetId: 'endpoints',
        title: 'Endpoints Configuration',
        description: 'Configure API for root nodes ',
        dimension: boxSizes[0],
        component: <Config isWide={false} />,
    },
    apiStatus: {
        id: 'apiStatus',
        widgetId: 'apiStatus',
        title: 'API Status',
        description: 'Connection status for root nodes',
        dimension: boxSizes[0],
        component: <Status isWide={false} />,
    },
    logs: {
        id: 'logs',
        widgetId: 'logs',
        title: 'Logs',
        description: 'Watch console logs',
        dimension: boxSizes[0],
        component: <Logs isWide={false} />,
    },
    visual: {
        id: 'visual',
        widgetId: 'visual',
        title: 'Visual',
        description: 'High-level requests visualization by root node',
        dimension: boxSizes[0],
        component: <Visual isWide={false} />,
    },
    settings: {
        id: 'settings',
        widgetId: 'settings',
        title: 'Settings',
        description: 'Global settings',
        dimension: boxSizes[0],
        component: <GlobalSettings isWide={false} />,
    },
    preview: {
        id: 'preview',
        widgetId: 'preview',
        title: 'Preview',
        description: 'Preview a specific datapoint',
        dimension: boxSizes[0],
        component: <Preview isWide={false} />,
    },
};
