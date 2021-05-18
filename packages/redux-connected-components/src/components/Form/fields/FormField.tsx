import * as React from 'react';
import { Field, FieldType } from '../../../types/types';
import FieldBoolean from './FieldBoolean';
import FieldDate from './FieldDate';
import FieldNumber from './FieldNumber';
import FieldParagraph from './FieldParagraph';
import FieldSelect from './FieldSelect';
import FieldText from './FieldText';
import FieldUrl from './FieldUrl';

type FieldProps = {
    field: Field;
    item: any;
    values: any;
    onChange: (field: Field, value: any) => void;
};

export function FormField(props: FieldProps) {
    const { field, item, values } = props;
    const { fieldType } = field;

    let Cmp;

    switch (fieldType) {
        case FieldType.BOOLEAN:
            Cmp = FieldBoolean;
            break;
        case FieldType.DATE:
            Cmp = FieldDate;
            break;
        case FieldType.NUMBER:
            Cmp = FieldNumber;
            break;
        case FieldType.PARAGRAPH:
            Cmp = FieldParagraph;
            break;
        case FieldType.SELECT:
            Cmp = FieldSelect;
            break;
        case FieldType.TEXT:
            Cmp = FieldText;
            break;
        case FieldType.URL:
            Cmp = FieldUrl;
            break;
        default:
            Cmp = FieldText;
            break;
    }

    return <Cmp key={field.key} field={field} item={item} values={values} onChange={props.onChange} />;
}

export default FormField;
