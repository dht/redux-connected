import * as React from 'react';
import { Field } from '../../../types/types';

type FieldSelectProps = {
    field: Field;
    item: any;
    values: any;
    onChange: (field: Field, value: any) => void;
};

export function FieldSelect(props: FieldSelectProps) {
    const { field, item = {}, values } = props;
    const { key, fieldOptions = [] } = field;

    function onChange(ev: React.ChangeEvent<HTMLSelectElement>) {
        props.onChange(field, ev.target.value);
    }

    function renderOptions() {
        return fieldOptions.map((option) => (
            <option key={option.key} value={option.key}>
                {option.title}
            </option>
        ));
    }

    const value = typeof values[key] !== 'undefined' ? values[key] : item[key];

    return (
        <div className="Field-container">
            <label>{field.title}</label>
            <div className="value">
                <select value={value} onChange={onChange} placeholder="Select a value...">
                    <option key="" value=""></option>
                    {renderOptions()}
                </select>
            </div>
        </div>
    );
}

export default FieldSelect;
