import * as React from 'react';
import { Field } from '../../types/types';
import cssPrefix from '../prefix';
import DetailsValue from './values/DetailsValue';

type DetailsProps = {
    fields: Field[];
    item: any;
};

export function Details(props: DetailsProps) {
    const { fields = [], item } = props;

    function renderFields() {
        return fields.map((field) => <DetailsValue key={field.key} item={item} field={field} />);
    }

    return <div className={`${cssPrefix}Details-container`}>{renderFields()}</div>;
}

export default Details;
