import { layout } from '../../data/layoutDefault';
import { IPanel } from 'igrid';

export const panels: Record<string, IPanel> = {
    p1: {
        id: 'p1',
        widgetId: 'spark',
        title: 'Spark',
        description: 'See events visually',
        ...layout.full,
    },
};
