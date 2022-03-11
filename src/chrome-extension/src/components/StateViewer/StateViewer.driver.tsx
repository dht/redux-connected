import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { StateViewer, StateViewerProps } from './StateViewer';
import { BaseComponentDriver } from '@payem/testing-base';

export class StateViewerDriver extends BaseComponentDriver {
    private props: Partial<StateViewerProps> = {};

    constructor() {
        super('StateViewer');
    }

    when: any = {
        rendered: () => {
            render(<StateViewer {...this.props} />);
            return this;
        },
        click: () => {
            fireEvent.click(this.container);
            return this;
        },
    };

    given: any = {
        props: (props: Partial<StateViewerProps>) => {
            this.props = props;
            return this;
        },
    };

    get = {
        containerClassName: () => {
            return this.container.className;
        },
    };
}
