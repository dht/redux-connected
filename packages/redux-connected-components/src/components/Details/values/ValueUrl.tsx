import * as React from 'react';
import { Field } from '../../../types/types';

type ValueUrlProps = {
    field: Field;
    item: any;
};

export function ValueUrl(props: ValueUrlProps) {
    const { field, item = {} } = props;

    const value = item[field.key];

    return (
        <div className="Value-container">
            <label>{field.title}</label>
            <div className="value ellipsis" title={value}>
                {value}
            </div>
        </div>
    );
}

export default ValueUrl;
