import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Lifecycle, LifecycleProps } from './Lifecycle';
import { BaseComponentDriver } from '@payem/testing-base';

export class LifecycleDriver extends BaseComponentDriver {
    private props: Partial<LifecycleProps> = {};

    constructor() {
        super('Lifecycle');
    }

    when: any = {
        rendered: () => {
            render(<Lifecycle {...this.props} />);
            return this;
        },
        click: () => {
            fireEvent.click(this.container);
            return this;
        },
    };

    given: any = {
        props: (props: Partial<LifecycleProps>) => {
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
