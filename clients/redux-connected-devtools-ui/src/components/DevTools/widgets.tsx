import React from 'react';
import { IWidget } from 'igrid';
import Monitor from '../Monitor/Monitor';
import Requests from '../Requests/Requests';
import Redux from '../Redux/Redux';
import Config from '../Config/Config';
import Status from '../Status/Status';
import Preview from '../Preview/Preview';
import Logs from '../Logs/Logs';
import Visual from '../Visual/Visual';
import GlobalSettings from '../GlobalSettings/GlobalSettings';
import Timeline from '../Timeline/Timeline';

export const widgets: Record<string, IWidget> = {
    processes: {
        id: 'processes',
        widgetId: 'processes',
        title: 'Processes',
        description: 'Start & stop processes',
        dimension: { x: 13, y: 17 },
        component: (props: any) => <Monitor {...props} />,
        props: {},
    },
    requests: {
        id: 'requests',
        widgetId: 'requests',
        title: 'Requests',
        description: 'Monitor API requests',
        dimension: { x: 13, y: 17 },
        component: (props: any) => <Requests {...props} />,
        props: {},
    },
    endpoints: {
        id: 'endpoints',
        widgetId: 'endpoints',
        title: 'Endpoints Configuration',
        description: 'Configure API for root nodes ',
        dimension: { x: 12, y: 17 },
        component: (props: any) => <Config {...props} />,
        props: {},
    },
    apiStatus: {
        id: 'apiStatus',
        widgetId: 'apiStatus',
        title: 'API Status',
        description: 'Connection status for root nodes',
        dimension: { x: 12, y: 17 },
        component: (props: any) => <Status {...props} />,
        props: {},
    },
    logs: {
        id: 'logs',
        widgetId: 'logs',
        title: 'Logs',
        description: 'Watch console logs',
        dimension: { x: 12, y: 17 },
        component: (props: any) => <Logs {...props} />,
        props: {},
    },
    visual: {
        id: 'visual',
        widgetId: 'visual',
        title: 'Visual',
        description: 'High-level requests visualization by root node',
        dimension: { x: 13, y: 17 },
        component: (props: any) => <Visual {...props} />,
        props: {},
    },
    settings: {
        id: 'settings',
        widgetId: 'settings',
        title: 'Settings',
        description: 'Global settings',
        dimension: { x: 13, y: 17 },
        component: (props: any) => <GlobalSettings {...props} />,
        props: {},
    },
    preview: {
        id: 'preview',
        widgetId: 'preview',
        title: 'Preview',
        description: 'Preview a specific datapoint',
        dimension: { x: 12, y: 17 },
        component: (props: any) => <Preview {...props} />,
        props: {},
    },
    redux: {
        id: 'redux',
        widgetId: 'redux',
        title: 'Redux devtools',
        description: 'Watch actions and state changes',
        dimension: { x: 53, y: 33 },
        component: (props: any) => <Redux {...props} />,
        props: {},
    },
    timeline: {
        id: 'timeline',
        widgetId: 'timeline',
        title: 'Timeline',
        description: 'Timeline',
        dimension: { x: 53, y: 20 },
        component: (props: any) => <Timeline {...props} />,
        props: {},
    },
};
