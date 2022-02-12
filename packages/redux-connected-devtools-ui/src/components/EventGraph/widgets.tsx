import React from 'react';
import { IWidget } from 'igrid';
import Spark from '../Spark/Spark';

export const widgets: Record<string, IWidget> = {
    spark: {
        id: 'spark',
        widgetId: 'spark',
        title: 'Spark',
        description: 'See events visually',
        dimension: { x: 54, y: 96 },
        component: (props: any) => <Spark {...props} />,
        props: {},
    },
};
