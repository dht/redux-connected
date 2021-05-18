import { Chance } from 'chance';
import { Field, FieldType } from '../types/types';

type Data = Record<string, any>;

export const generateRandomData = (fields: Field[]): Data => {
    const output = {} as Data;
    const chance = new Chance();

    fields.forEach((field) => {
        const { key, fieldType, fieldOptions = [] } = field;
        const options = fieldOptions.map((option) => option.key);

        switch (fieldType) {
            case FieldType.BOOLEAN:
                output[key] = chance.bool();
                break;
            case FieldType.DATE:
                output[key] = chance.date();
                break;
            case FieldType.NUMBER:
                output[key] = chance.integer({ min: 10, max: 500 });
                break;
            case FieldType.PARAGRAPH:
                output[key] = chance.paragraph();
                break;
            case FieldType.SELECT:
                output[key] = chance.pickone(options);
                break;
            case FieldType.TEXT:
                output[key] = chance.word();
                break;
            case FieldType.URL:
                output[key] = chance.avatar() + '?s=64&d=identicon&r=PG';
                break;
        }
    });

    return output;
};
