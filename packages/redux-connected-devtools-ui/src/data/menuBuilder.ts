import PageRoot from '../components/PageRoot/PageRoot';
import { Json } from 'redux-store-generator';
import EventGraph from '../components/EventGraph/EventGraph';
import DevTools from '../components/DevTools/DevTools';

export type MenuItem = {
    id: string;
    path: string;
    component: (props: any) => JSX.Element;
    componentProps?: Json;
    title?: string;
    icon?: string;
    hidden?: boolean;
    disabled?: boolean;
    groupId?: string;
    showOnSlim?: boolean;
};

export const menuData: MenuItem[] = [
    {
        id: 'root',
        path: '/',
        component: PageRoot,
    },
    {
        id: 'live',
        title: 'Live Monitor',
        icon: 'OEM',
        path: '/live',
        component: DevTools,
        groupId: 'Develop',
        showOnSlim: true,
    },
    {
        id: 'eventGraph',
        title: 'Event Graph',
        icon: 'TimelineProgress',
        path: '/graph',
        component: EventGraph,
        groupId: 'Develop',
        showOnSlim: true,
    },
];

export const dataGroups = ['Develop'];
