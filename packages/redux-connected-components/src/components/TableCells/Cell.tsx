import * as React from 'react';
import { ColumnType, CellProps } from '../../types/types';
import { CellActions } from './CellActions';
import { CellDate } from './CellDate';
import { CellPrice } from './CellPrice';
import { CellText } from './CellText';
import { CellThumbnail } from './CellThumbnail';

export function Cell(props: CellProps) {
    const { column } = props;
    const { columnType } = column;

    switch (columnType) {
        case ColumnType.TEXT:
            return <CellText {...props} />;
        case ColumnType.THUMBNAIL:
            return <CellThumbnail {...props} />;
        case ColumnType.ACTIONS:
            return <CellActions {...props} />;
        case ColumnType.PRICE:
            return <CellPrice {...props} />;
        case ColumnType.DATE:
            return <CellDate {...props} />;
        default:
            return <CellText {...props} />;
    }
}
