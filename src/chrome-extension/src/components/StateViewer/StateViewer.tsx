import React from 'react';
import { Container } from './StateViewer.style';

export type StateViewerProps = {};

export function StateViewer(_props: StateViewerProps) {
    return (
        <Container
            className='StateViewer-container'
            data-testid='StateViewer-container'
        >
            StateViewer
        </Container>
    );
}

export default StateViewer;
