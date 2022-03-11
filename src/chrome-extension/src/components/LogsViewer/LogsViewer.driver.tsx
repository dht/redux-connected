import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { LogsViewer, LogsViewerProps } from './LogsViewer';
import { BaseComponentDriver } from '@payem/testing-base';

export class LogsViewerDriver extends BaseComponentDriver {
    private props: Partial<LogsViewerProps> = {};

    constructor() {
        super('LogsViewer');
    }

    when: any = {
        rendered: () => {
            render(<LogsViewer {...this.props} />);
            return this;
        },
        click: () => {
            fireEvent.click(this.container);
            return this;
        },
    };

    given: any = {
        props: (props: Partial<LogsViewerProps>) => {
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
