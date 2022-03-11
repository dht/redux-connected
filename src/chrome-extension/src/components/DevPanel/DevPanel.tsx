import React from 'react';
import DevMenu from '../../containers/DevMenuContainer';
import { Container, Content } from './DevPanel.style';

export type DevPanelProps = {};

export function DevPanel(props: DevPanelProps) {
    return (
        <Container
            className='DevPanel-container'
            data-testid='DevPanel-container'
        >
            <DevMenu />
            <Content></Content>
        </Container>
    );
}

export default DevPanel;
