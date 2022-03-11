import React from 'react';
import { Container } from './Lifecycle.style';

export type LifecycleProps = {};

export function Lifecycle(_props: LifecycleProps) {
    return (
        <Container
            className='Lifecycle-container'
            data-testid='Lifecycle-container'
        >
            Lifecycle
        </Container>
    );
}

export default Lifecycle;
