import * as React from 'react';
import { Field } from '../../../types/types';

type FieldNumberProps = {
    field: Field;
    item: any;
    values: any;
    onChange: (field: Field, value: any) => void;
};

export function FieldNumber(props: FieldNumberProps) {
    const { field, item = {}, values } = props;
    const { key } = field;

    function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
        props.onChange(field, ev.target.value);
    }

    const value = (typeof values[key] !== 'undefined' ? values[key] : item[key]) || '';

    return (
        <div className="Field-container">
            <label>{field.title}</label>
            <div className="value">
                <input type="number" value={value} onChange={onChange}></input>
            </div>
        </div>
    );
}

export default FieldNumber;
