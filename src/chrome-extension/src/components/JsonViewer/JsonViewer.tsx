import React from 'react';
import { Container } from './JsonViewer.style';

export type JsonViewerProps = {};

export function JsonViewer(_props: JsonViewerProps) {
    return (
        <Container className="JsonViewer-container" data-testid="JsonViewer-container">
            JsonViewer
        </Container>
    );
}

export default JsonViewer;
