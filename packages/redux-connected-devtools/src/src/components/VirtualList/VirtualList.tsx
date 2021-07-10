import * as React from 'react';
import { FixedSizeList } from 'react-window';
import classnames from 'classnames';
import cssPrefix from '../prefix';

type VirtualListProps = {
    children: any;
    items: any[];
    className?: string;
    height: number;
    onClick?(item: any): void;
};

export type VirtualListRowProps = {
    index: number;
    style: any;
    data: any;
};

function EmptyList() {
    return <div className={`${cssPrefix}EmptyList-container`}>Empty List</div>;
}

export interface VirtualListItemWithEvent<T> {
    onClick(): void;
    item: T;
}

export function VirtualList<T>(props: VirtualListProps) {
    const { items, height } = props;

    const selectable = typeof props.onClick === 'function';

    const className = classnames(`${cssPrefix}VirtualList-container`, props.className, {
        selectable,
    });

    if (items.length === 0) {
        return <EmptyList />;
    }

    const itemsWithClick = items.map((item) => {
        return {
            onClick: () => {
                if (props.onClick) {
                    props.onClick(item);
                }
            },
            item,
        };
    }) as VirtualListItemWithEvent<T>[];

    return (
        <div className={className}>
            <FixedSizeList
                height={height}
                itemCount={items.length}
                itemSize={45}
                itemData={itemsWithClick}
                width={'100%'}
            >
                {props.children}
            </FixedSizeList>
        </div>
    );
}

export default VirtualList;
