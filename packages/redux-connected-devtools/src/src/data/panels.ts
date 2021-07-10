import { layout } from './layoutDefault';
import { IPanel } from 'igrid';

export const panels: Record<string, IPanel> = {
    p1: {
        id: 'p1',
        widgetId: 'processes',
        title: 'Processes',
        description: 'Start & stop processes',
        ...layout.topLeft1,
    },
    p2: {
        id: 'p2',
        widgetId: 'requests',
        title: 'Requests',
        description: 'Monitor API requests',
        ...layout.bottomRight2,
    },
    p3: {
        id: 'p3',
        widgetId: 'endpoints',
        title: 'Endpoints Configuration',
        description: 'Configure API for root nodes ',
        ...layout.bottomRight1,
    },
    p4: {
        id: 'p4',
        widgetId: 'apiStatus',
        title: 'API Status',
        description: 'Connection status for root nodes',
        ...layout.bottomLeft2,
    },
    p5: {
        id: 'p5',
        widgetId: 'logs',
        title: 'Logs',
        description: 'Watch console logs',
        ...layout.topLeft2,
    },
    p6: {
        id: 'p6',
        widgetId: 'visual',
        title: 'Visual',
        description: 'High-level requests visualization by root node',
        ...layout.topRight2,
    },
    p7: {
        id: 'p7',
        widgetId: 'settings',
        title: 'Settings',
        description: 'Global settings',
        ...layout.bottomLeft1,
    },
    p8: {
        id: 'p8',
        widgetId: 'preview',
        title: 'Preview',
        description: 'Preview a specific datapoint',
        ...layout.topRight1,
    },
    p9: {
        id: 'p9',
        widgetId: 'redux',
        title: 'Redux devtools',
        description: 'Watch actions and state changes',
        ...layout.center1,
    },
    p10: {
        id: 'p10',
        widgetId: 'timeline',
        title: 'Timeline',
        description: 'See redux events timeline',
        ...layout.center2,
    },
};
