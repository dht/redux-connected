import * as React from 'react';
import classnames from 'classnames';
import { ColumnConfig, Item, SortOrders } from '../../types/types';
import { FixedSizeList } from 'react-window';
import { TableEndlessHeader } from './TableEndlessHeader';
import { useState } from 'react';
import { Cell } from '../TableCells/Cell';
import InfiniteLoader from 'react-window-infinite-loader';
import cssPrefix from '../prefix';

type TableEndlessProps = {
    children?: any;
    items: any[];
    height: number;
    className?: string;
    onClick?(item: any): void;
    onAction?: (actionId: string, item: Item) => void;
    columns?: ColumnConfig[];
    onSortChange?: (sortOrders: SortOrders) => void;
    itemsPerPage?: number;
    hasNextPage?: boolean;
    isNextPageLoading?: boolean;
    loadNextPage?: (startIndex: number, stopIndex: number) => Promise<any>;
    showCount?: boolean;
};

export type TableEndlessRowProps = {
    index: number;
    style: any;
    data: any;
};

export type InfiniteLoaderParams = {
    onItemsRendered: (props: any) => void;
    ref: React.LegacyRef<any>;
};

const blankFunction = () => {};

export function TableEndless(props: TableEndlessProps) {
    const { items, height, columns = [], hasNextPage, isNextPageLoading, showCount } = props;
    const [sortOrder, setSortOrder] = useState<SortOrders>({});
    const onRowClick = props.onClick || blankFunction;

    const selectable = typeof props.onClick === 'function';

    const className = classnames(`${cssPrefix}TableEndless-container`, props.className, {
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

    const TableRow = (rowProps: TableEndlessRowProps) => {
        const { index } = rowProps;
        const item: Item = rowProps.data[index];

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

    // If there are more items to be loaded then add an extra row to hold a loading indicator.
    const itemCount = hasNextPage ? items.length + 1 : items.length;

    // Only load 1 page of items at a time.
    // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.

    const loadMoreItems = isNextPageLoading ? () => {} : props.loadNextPage;

    // Every row is loaded except for our loading indicator row.
    const isItemLoaded = (index: number) => !hasNextPage || index < items.length;

    return (
        <div className={className}>
            <TableEndlessHeader columns={columns} sortOrder={sortOrder} setSortOrder={changeSort} />
            <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems as any}>
                {(params: InfiniteLoaderParams) => (
                    <FixedSizeList
                        className="table"
                        height={height}
                        itemCount={items.length}
                        itemSize={45}
                        itemData={items}
                        width={'100%'}
                        onItemsRendered={params.onItemsRendered}
                        ref={params.ref}
                    >
                        {props.children || TableRow}
                    </FixedSizeList>
                )}
            </InfiniteLoader>
            {showCount && <div className="count">{items.length} items</div>}
        </div>
    );
}

function EmptyList() {
    return <div className="EmptyList-container">Empty List</div>;
}

export default TableEndless;
