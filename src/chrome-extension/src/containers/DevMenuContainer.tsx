import React from 'react';
import { DevMenu } from '../components/DevMenu/DevMenu';
import { devGroups, devRoutes } from '../data/devRouter';

export function DevMenuContainer() {
    return <DevMenu groups={devGroups} items={devRoutes} />;
}

export default DevMenuContainer;
