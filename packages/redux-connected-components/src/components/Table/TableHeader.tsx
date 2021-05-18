import * as React from 'react';
import { ColumnConfig, SortOrder, SortOrders } from '../../types/types';
import classnames from 'classnames';

type HeaderProps = {
    columns: ColumnConfig[];
    sortOrder: SortOrders;
    setSortOrder: (sortOrder: SortOrders) => void;
};

export function TableHeader(props: HeaderProps) {
    const { columns, sortOrder } = props;

    function onHeaderClick(column: ColumnConfig) {
        const { key } = column;

        let nextOrder;

        switch (sortOrder[key]) {
            case sortOrder.NONE:
                nextOrder = SortOrder.ASCENDING;
                break;
            case SortOrder.ASCENDING:
                nextOrder = SortOrder.DESCENDING;
                break;
            case SortOrder.DESCENDING:
                nextOrder = SortOrder.NONE;
                break;
            default:
                nextOrder = SortOrder.ASCENDING;
        }

        props.setSortOrder({
            [key]: nextOrder,
        });
    }

    return (
        <div className="header">
            {columns.map((column) => (
                <HeaderCell
                    key={column.key}
                    column={column}
                    onClick={() => onHeaderClick(column)}
                    sortOrder={sortOrder[column.key]}
                />
            ))}
        </div>
    );
}

type HeaderCellProps = {
    column: ColumnConfig;
    onClick: (item: any) => void;
    sortOrder?: SortOrder;
};

function HeaderCell(props: HeaderCellProps) {
    const { column, sortOrder } = props;
    const { width, title } = column;

    function renderSortIcon() {
        let icon;

        switch (sortOrder) {
            case SortOrder.ASCENDING:
                icon = 'expand_more';
                break;
            case SortOrder.DESCENDING:
                icon = 'expand_less';
                break;
            default:
        }

        if (!icon) {
            return null;
        }

        return <span className="material-icons icon">{icon}</span>;
    }

    const className = classnames('col', {
        empty: !title,
    });

    return (
        <div className={className} style={{ width }} onClick={() => props.onClick(column)}>
            {title}
            {renderSortIcon()}
        </div>
    );
}
