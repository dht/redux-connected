import React from 'react';
import { IWidget } from 'igrid';
import Timeline from '../components/Timeline/Timeline';

export const widgets: Record<string, IWidget> = {
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
        props: {},
    },
};
