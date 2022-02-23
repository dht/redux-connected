import React, { useEffect, useRef } from 'react';
import { Route, Switch } from 'react-router-dom';
import { menuData, MenuItem } from '../data/menuBuilder';

export const Routes = () => {
    return (
        <Switch>
            {menuData.map((route: MenuItem) => {
                const Cmp = route.component;

                return (
                    <Route
                        exact
                        key={route.id}
                        path={route.path}
                        component={Cmp}
                    />
                );
            })}
        </Switch>
    );
};
