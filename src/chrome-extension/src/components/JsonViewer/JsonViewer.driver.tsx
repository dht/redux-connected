import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { JsonViewer, JsonViewerProps } from './JsonViewer';
import { BaseComponentDriver } from '@payem/testing-base';

export class JsonViewerDriver extends BaseComponentDriver {
    private props: Partial<JsonViewerProps> = {};

    constructor() {
        super('JsonViewer');
    }

    when: any = {
        rendered: () => {
            render(<JsonViewer {...this.props} />);
            return this;
        },
        click: () => {
            fireEvent.click(this.container);
            return this;
        },
    };

    given: any = {
        props: (props: Partial<JsonViewerProps>) => {
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
