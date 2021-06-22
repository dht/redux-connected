import { Panel } from './../types';
import { boxSizes } from './boxSizes';

export const panels: Record<string, Panel> = [
    {
        id: 'processes',
        title: 'Processes',
        description: 'Start & stop processes',
        dimension: boxSizes[0],
    },
    {
        id: 'requests',
        title: 'Requests',
        description: 'Monitor API requests',
        dimension: boxSizes[0],
    },
    {
        id: 'redux',
        title: 'Redux devtools',
        description: 'Watch actions and state changes',
        dimension: boxSizes[1],
    },
    {
        id: 'endpoints',
        title: 'Endpoints Configuration',
        description: 'Configure API for root nodes ',
        dimension: boxSizes[0],
    },
    {
        id: 'apiStatus',
        title: 'API Status',
        description: 'Connection status for root nodes',
        dimension: boxSizes[0],
    },
    {
        id: 'logs',
        title: 'Logs',
        description: 'Watch console logs',
        dimension: boxSizes[0],
    },
    {
        id: 'visual',
        title: 'Visual',
        description: 'High-level requests visualization by root node',
        dimension: boxSizes[0],
    },
    {
        id: 'settings',
        title: 'Settings',
        description: 'Global settings',
        dimension: boxSizes[0],
    },
    {
        id: 'preview',
        title: 'Preview',
        description: 'Preview a specific datapoint',
        dimension: boxSizes[0],
    },
];
