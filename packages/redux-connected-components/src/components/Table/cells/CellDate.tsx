import * as React from 'react';
import { CellProps } from '../../../types/types';
import { format } from 'date-fns';

export function CellDate(props: CellProps) {
    const { column, item } = props;
    const { key, width } = column;

    const data = item[key];
    let dateText = '';

    if (data) {
        dateText = format(new Date(data), 'yyyy-MM-dd');
    }

    return (
        <div key={key} className="col" style={{ width }}>
            {dateText}
        </div>
    );
}
