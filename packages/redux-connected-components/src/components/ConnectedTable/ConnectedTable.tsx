import * as React from 'react';
import TableBar from '../TableBar/TableBar';
import { CollectionBag } from 'redux-store-generator';
import { ColumnConfig, Field, FilterConfig, Item } from '../../types/types';
import { useCrudModals } from '../CrudModals/useCrudModals';
import Filter from '../Filter/Filter';
import { useTableState } from './useTableState';
import cssPrefix from '../prefix';
import { TablePagination } from '../..';

type ConnectedTableProps = {
    actions: CollectionBag<any>;
    selector: any;
    columns: ColumnConfig[];
    filters: FilterConfig[];
    fields: Field[];
    height?: number;
    itemsPerPage?: number;
};

export function ConnectedTable(props: ConnectedTableProps) {
    const { actions, columns, filters, fields, height = 600, itemsPerPage = 15, selector } = props;
    const [crudModalsJsx, { onAction }] = useCrudModals(fields, actions);
    const [items, data, methods] = useTableState(actions, selector, {
        itemsPerPage,
    });

    return (
        <div className={`${cssPrefix}ConnectedTable-container`}>
            <div className="col">
                <TableBar
                    search={data.search}
                    onSearch={methods.setSearch}
                    onToggleFilter={methods.toggleFilter}
                    onNew={() => onAction('new', {})}
                />
                <Filter
                    show={data.showFilter}
                    filters={filters}
                    currentFilters={data.currentFilters}
                    onFilter={methods.setCurrentFilters}
                />
                <TablePagination
                    className="filtered-table"
                    onClick={(item: Item) => onAction('view', item)}
                    onAction={onAction}
                    items={items}
                    height={data.showFilter ? height - 240 : height}
                    columns={columns}
                    onSortChange={methods.setSortOrder}
                    itemsPerPage={itemsPerPage}
                    hasNextPage={data.hasNextPage}
                    isNextPageLoading={data.isNextPageLoading}
                    loadNextPage={methods.loadNextPage}
                    showCount={true}
                />
                {crudModalsJsx}
            </div>
        </div>
    );
}

export default ConnectedTable;
