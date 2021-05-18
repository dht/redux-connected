import * as React from 'react';
import { Field } from '../../../types/types';
import { format } from 'date-fns';

type ValueDateProps = {
    field: Field;
    item: any;
};

export function ValueDate(props: ValueDateProps) {
    const { field, item = {} } = props;

    const value = item[field.key];
    let dateText;

    if (value) {
        dateText = format(new Date(value), 'yyyy-MM-dd');
    }

    return (
        <div className="Value-container">
            <label>{field.title}</label>
            <div className="value">{dateText}</div>
        </div>
    );
}

export default ValueDate;
