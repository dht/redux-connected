import * as React from 'react';
import { CellProps } from '../../types/types';

export function CellText(props: CellProps) {
    const { column, item } = props;
    const { key, width } = column;

    const data = item[key];

    return (
        <div key={key} className="col" style={{ width }}>
            {data}
        </div>
    );
}
