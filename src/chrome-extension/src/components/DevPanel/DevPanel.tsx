import React from 'react';
import DevMenu from '../../containers/DevMenuContainer';
import { devRoutes, IDevRoute } from '../../data/devRouter';
import { devComponents } from '../../data/devComponents';
import { Container, Content } from './DevPanel.style';
import { Routes, Route, useNavigate } from 'react-router-dom';

export type DevPanelProps = {};

export function DevPanel(props: DevPanelProps) {
    const navigate = useNavigate();

    function onMenuClick(item: IDevRoute) {
        console.log('item ->', item);
        navigate(item.path);
    }

    function renderItem(devRoute: IDevRoute) {
        const { componentId } = devRoute;
        const component = devComponents[componentId];

        return <Route path='/'>{component}</Route>;
    }

    function renderItems() {
        return devRoutes.map((devRoutes: IDevRoute) => renderItem(devRoutes));
    }

    return (
        <Container
            className='DevPanel-container'
            data-testid='DevPanel-container'
        >
            <DevMenu onClick={onMenuClick} />
            <Content>
                <Routes>{renderItems()}</Routes>
            </Content>
        </Container>
    );
}

export default DevPanel;
