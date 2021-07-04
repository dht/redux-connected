import React from 'react';
import { IWidget } from 'igrid';
import Monitor from '../components/Monitor/Monitor';
import Requests from '../components/Requests/Requests';
import Redux from '../components/Redux/Redux';
import Config from '../components/Config/Config';
import Status from '../components/Status/Status';
import Preview from '../components/Preview/Preview';
import Logs from '../components/Logs/Logs';
import Visual from '../components/Visual/Visual';
import GlobalSettings from '../components/GlobalSettings/GlobalSettings';
import Timeline from '../components/Timeline/Timeline';

export const widgets: Record<string, IWidget> = {
    processes: {
        id: 'processes',
        widgetId: 'processes',
        title: 'Processes',
        description: 'Start & stop processes',
        dimension: {
            x: 13,
            y: 17,
        },
        component: (props: any) => <Monitor {...props} />,
        props: {
            isWide: false,
        },
    },
    requests: {
        id: 'requests',
        widgetId: 'requests',
        title: 'Requests',
        description: 'Monitor API requests',
        dimension: {
            x: 13,
            y: 17,
        },
        component: (props: any) => <Requests {...props} />,
        props: {
            isWide: false,
        },
    },
    endpoints: {
        id: 'endpoints',
        widgetId: 'endpoints',
        title: 'Endpoints Configuration',
        description: 'Configure API for root nodes ',
        dimension: {
            x: 13,
            y: 17,
        },
        component: (props: any) => <Config {...props} />,
        props: {
            isWide: false,
        },
    },
    apiStatus: {
        id: 'apiStatus',
        widgetId: 'apiStatus',
        title: 'API Status',
        description: 'Connection status for root nodes',
        dimension: {
            x: 13,
            y: 17,
        },
        component: (props: any) => <Status {...props} />,
        props: {
            isWide: false,
        },
    },
    logs: {
        id: 'logs',
        widgetId: 'logs',
        title: 'Logs',
        description: 'Watch console logs',
        dimension: {
            x: 13,
            y: 17,
        },
        component: (props: any) => <Logs {...props} />,
        props: {
            isWide: false,
        },
    },
    visual: {
        id: 'visual',
        widgetId: 'visual',
        title: 'Visual',
        description: 'High-level requests visualization by root node',
        dimension: {
            x: 13,
            y: 17,
        },
        component: (props: any) => <Visual {...props} />,
        props: {
            isWide: false,
        },
    },
    settings: {
        id: 'settings',
        widgetId: 'settings',
        title: 'Settings',
        description: 'Global settings',
        dimension: {
            x: 13,
            y: 17,
        },
        component: (props: any) => <GlobalSettings {...props} />,
        props: {
            isWide: false,
        },
    },
    preview: {
        id: 'preview',
        widgetId: 'preview',
        title: 'Preview',
        description: 'Preview a specific datapoint',
        dimension: {
            x: 13,
            y: 17,
        },
        component: (props: any) => <Preview {...props} />,
        props: {
            isWide: false,
        },
    },
    redux: {
        id: 'redux',
        widgetId: 'redux',
        title: 'Redux devtools',
        description: 'Watch actions and state changes',
        dimension: {
            x: 24,
            y: 33,
        },
        component: (props: any) => <Redux {...props} />,
        props: {
            isWide: true,
        },
    },
    timeline: {
        id: 'timeline',
        widgetId: 'timeline',
        title: 'Timeline',
        description: 'Timeline',
        dimension: {
            x: 55,
            y: 20,
        },
        component: (props: any) => <Timeline {...props} />,
        props: {
            isWide: true,
        },
    },
};
