import * as React from 'react';
import { CellProps } from '../../types/types';

export function CellPrice(props: CellProps) {
    const { column, item } = props;
    const { key, width } = column;

    const data = item[key];

    let text = data;

    if (Number.isFinite(data)) {
        text = Number(data).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    return (
        <div key={key} className="col" style={{ width }}>
            {text}
        </div>
    );
}
