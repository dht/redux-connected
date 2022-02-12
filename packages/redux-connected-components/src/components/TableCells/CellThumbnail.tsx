import * as React from 'react';
import { CellProps } from '../../types/types';

export function CellThumbnail(props: CellProps) {
    const { column, item } = props;
    const { key, width } = column;

    const data = item[key];

    return (
        <div key={key} className="col" style={{ width }}>
            <img src={data} width={30} height={30} />
        </div>
    );
}
