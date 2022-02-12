import * as React from 'react';
import { Field } from '../../../types/types';

type ValueParagraphProps = {
    field: Field;
    item: any;
};

export function ValueParagraph(props: ValueParagraphProps) {
    const { field, item = {} } = props;

    const value = item[field.key];

    return (
        <div className="Value-container">
            <label>{field.title}</label>
            <div className="value">{value}</div>
        </div>
    );
}

export default ValueParagraph;
