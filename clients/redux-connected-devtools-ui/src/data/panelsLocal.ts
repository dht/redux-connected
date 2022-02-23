import { layout } from './layoutDefault';
import { IPanel } from 'igrid';

export const panels: Record<string, IPanel> = {
    p1: {
        id: 'p1',
        widgetId: 'timeline',
        title: 'Timeline',
        description: 'See redux events timeline',
        ...layout.portrait,
        props: {
            selector: (state: any) => Object.values(state.sagas),
        },
    },
};
