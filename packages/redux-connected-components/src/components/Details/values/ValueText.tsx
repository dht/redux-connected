import * as React from 'react';
import { Field } from '../../../types/types';

type ValueTextProps = {
    field: Field;
    item: any;
};

export function ValueText(props: ValueTextProps) {
    const { field, item = {} } = props;

    const value = item[field.key];

    return (
        <div className="Value-container">
            <label>{field.title}</label>
            <div className="value">{value}</div>
        </div>
    );
}

export default ValueText;
