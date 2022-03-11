export type IDevRoute = {
    path: string;
    title: string;
    group: string;
    componentId: string;
};

export const devRoutes: IDevRoute[] = [
    {
        path: '/lifecycle/original',
        title: '1. Original',
        group: 'lifecycle',
        componentId: 'Lifecycle',
    },
    {
        path: '/lifecycle/gatekeeper',
        title: '2. Gatekeeper',
        group: 'lifecycle',
        componentId: 'Lifecycle',
    },
    {
        path: '/lifecycle/incoming',
        title: '3. Incoming',
        group: 'lifecycle',
        componentId: 'Lifecycle',
    },
    {
        path: '/lifecycle/queue',
        title: '4. Queue',
        group: 'lifecycle',
        componentId: 'Lifecycle',
    },
    {
        path: '/lifecycle/firing',
        title: '5. Firing',
        group: 'lifecycle',
        componentId: 'Lifecycle',
    },
    {
        path: '/lifecycle/api',
        title: '6. API',
        group: 'lifecycle',
        componentId: 'Lifecycle',
    },
    {
        path: '/lifecycle/error',
        title: '7. Error',
        group: 'lifecycle',
        componentId: 'Lifecycle',
    },
    {
        path: '/lifecycle/postAction',
        title: '8. Post-action',
        group: 'lifecycle',
        componentId: 'Lifecycle',
    },
    {
        path: '/logs',
        title: 'Logs',
        group: 'state',
        componentId: 'LogsViewer',
    },
    {
        path: '/state',
        title: 'State',
        group: 'state',
        componentId: 'StateViewer',
    },
    {
        path: '/sagas',
        title: 'Sagas',
        group: 'state',
        componentId: 'SagaViewer',
    },
    {
        path: '/settings/global',
        title: 'Global settings',
        group: 'settings & stats',
        componentId: 'JsonViewer',
    },
    {
        path: '/settings/endpoints',
        title: 'Endpoints configs',
        group: 'settings & stats',
        componentId: 'JsonViewer',
    },
    {
        path: '/stats/global',
        title: 'Global stats',
        group: 'settings & stats',
        componentId: 'JsonViewer',
    },
];

const getGroups = (): string[] => {
    const output: string[] = [];

    devRoutes.forEach((group) => {
        if (!output.includes(group.group)) {
            output.push(group.group);
        }
    });

    return output;
};

export const devGroups: string[] = getGroups();
