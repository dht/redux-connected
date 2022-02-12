import * as React from 'react';
import { Field, FieldType } from '../../../types/types';
import ValueBoolean from './ValueBoolean';
import ValueDate from './ValueDate';
import ValueNumber from './ValueNumber';
import ValueParagraph from './ValueParagraph';
import ValueSelect from './ValueSelect';
import ValueText from './ValueText';
import ValueUrl from './ValueUrl';

type ValueProps = {
    field: Field;
    item: any;
};

export function DetailsValue(props: ValueProps) {
    const { field, item } = props;
    const { fieldType } = field;

    let Cmp;

    switch (fieldType) {
        case FieldType.BOOLEAN:
            Cmp = ValueBoolean;
            break;
        case FieldType.DATE:
            Cmp = ValueDate;
            break;
        case FieldType.NUMBER:
            Cmp = ValueNumber;
            break;
        case FieldType.PARAGRAPH:
            Cmp = ValueParagraph;
            break;
        case FieldType.SELECT:
            Cmp = ValueSelect;
            break;
        case FieldType.TEXT:
            Cmp = ValueText;
            break;
        case FieldType.URL:
            Cmp = ValueUrl;
            break;
        default:
            Cmp = ValueText;
            break;
    }

    return <Cmp key={field.key} field={field} item={item} />;
}

export default DetailsValue;
