import React from 'react';
import { DevMenu } from '../components/DevMenu/DevMenu';
import { devGroups, devRoutes } from '../data/devRouter';

export function DevMenuContainer(props: any) {
    return (
        <DevMenu groups={devGroups} items={devRoutes} onClick={props.onClick} />
    );
}

export default DevMenuContainer;
