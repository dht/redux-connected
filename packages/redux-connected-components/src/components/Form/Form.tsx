import * as React from 'react';
import { useImperativeHandle } from 'react';
import { useMount, useSetState } from 'react-use';
import { Field } from '../../types/types';
import { generateRandomData } from '../../utils/random';
import cssPrefix from '../prefix';
import { FormField } from './fields/FormField';

type FormProps = {
    fields: Field[];
    item: any;
    formRef: any;
    saveAllFields?: boolean;
    autoGenerate?: boolean;
};

export type FormInterface = {
    getValues: () => Record<string, any>;
    generate: () => void;
};

export function Form(props: FormProps) {
    const { fields = [], item = {}, formRef, saveAllFields, autoGenerate } = props;
    const [values, patchValues] = useSetState({});

    useImperativeHandle(
        formRef,
        () => ({
            getValues: () => {
                if (saveAllFields) {
                    return { ...item, ...values };
                } else {
                    return values;
                }
            },
            generate: () => {
                const data = generateRandomData(fields);
                patchValues(data);
            },
        }),
        [values],
    );

    useMount(() => {
        if (autoGenerate) {
            const data = generateRandomData(fields);
            patchValues(data);
        }
    });

    function onChange(field: Field, value: any) {
        patchValues({
            [field.key]: value,
        });
    }

    function renderFields() {
        return fields.map((field) => (
            <FormField key={field.key} field={field} item={item} values={values} onChange={onChange} />
        ));
    }

    return <div className={`${cssPrefix}Form-container`}>{renderFields()}</div>;
}

export default Form;
