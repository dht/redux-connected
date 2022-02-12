import * as React from 'react';
import classnames from 'classnames';
import { ColumnConfig, Item, SortOrders } from '../../types/types';
import { TablePaginationHeader } from './TablePaginationHeader';
import { useState } from 'react';
import { Cell } from '../TableCells/Cell';
import cssPrefix from '../prefix';

type TablePaginationProps = {
    children?: any;
    items: any[];
    height: number;
    className?: string;
    onClick?(item: any): void;
    onAction?: (actionId: string, item: Item) => void;
    columns?: ColumnConfig[];
    onSortChange?: (sortOrders: SortOrders) => void;
    itemsPerPage?: number;
    page?: number;
    loadNextPage?: (startIndex: number, stopIndex: number) => Promise<any>;
};

export type TablePaginationRowProps = {
    index: number;
    style: any;
    data: any;
};

export type InfiniteLoaderParams = {
    onItemsRendered: (props: any) => void;
    ref: React.LegacyRef<any>;
};

const blankFunction = () => {};

export function TablePagination(props: TablePaginationProps) {
    const { items, columns = [], page = 1, itemsPerPage = 15 } = props;
    const [sortOrder, setSortOrder] = useState<SortOrders>({});
    const onRowClick = props.onClick || blankFunction;

    const selectable = typeof props.onClick === 'function';

    const className = classnames(`${cssPrefix}TablePagination-container`, props.className, {
        selectable,
    });

    if (items.length === 0) {
        return <EmptyList />;
    }

    function changeSort(newSortOrder: SortOrders) {
        setSortOrder(newSortOrder);
        if (props.onSortChange) {
            props.onSortChange(newSortOrder);
        }
    }

    const TableRow = (rowProps: TablePaginationRowProps) => {
        const { index } = rowProps;
        const item: Item = rowProps.data[index];

        if (!item) {
            return null;
        }

        const className = classnames('Item-container', {
            alternate: index % 2 === 0,
        });

        return (
            <div className={className} style={rowProps.style} onClick={() => onRowClick(item)} key={item.id}>
                {columns.map((column) => (
                    <Cell key={column.key} column={column} item={item} onActionClick={props.onAction} />
                ))}
            </div>
        );
    };

    function renderRow(index: number) {
        return <TableRow key={index} index={index} style={{}} data={items} />;
    }

    function renderRows() {
        let rows = [] as JSX.Element[];
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        for (let i = startIndex; i < endIndex; i++) {
            rows.push(renderRow(i));
        }

        return rows;
    }

    return (
        <div className={className}>
            <TablePaginationHeader columns={columns} sortOrder={sortOrder} setSortOrder={changeSort} />
            {renderRows()}
        </div>
    );
}

function EmptyList() {
    return <div className="EmptyList-container">Empty List</div>;
}

export default TablePagination;
