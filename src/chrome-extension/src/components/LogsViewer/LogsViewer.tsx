import React from 'react';
import { Container } from './LogsViewer.style';

export type LogsViewerProps = {};

export function LogsViewer(_props: LogsViewerProps) {
    return (
        <Container className="LogsViewer-container" data-testid="LogsViewer-container">
            LogsViewer
        </Container>
    );
}

export default LogsViewer;
