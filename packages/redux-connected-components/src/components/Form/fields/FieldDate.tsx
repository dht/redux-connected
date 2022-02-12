import * as React from 'react';
import { Field } from '../../../types/types';
import { format } from 'date-fns';

type FieldDateProps = {
    field: Field;
    item: any;
    values: any;
    onChange: (field: Field, value: any) => void;
};

export function FieldDate(props: FieldDateProps) {
    const { field, item = {}, values } = props;
    const { key } = field;

    function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
        props.onChange(field, ev.target.value);
    }

    const value = typeof values[key] !== 'undefined' ? values[key] : item[key];
    const now = new Date().getTime();
    const dateText = format(new Date(value || now), 'yyyy-MM-dd');

    return (
        <div className="Field-container">
            <label>{field.title}</label>
            <div className="value">
                <input type="date" value={dateText} onChange={onChange}></input>
            </div>
        </div>
    );
}

export default FieldDate;
