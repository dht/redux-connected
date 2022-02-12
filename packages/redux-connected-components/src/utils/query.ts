import { searchToQueryParams } from './search';
import { TableData } from '../components/ConnectedTable/useTableState';
import { sortToQueryParams } from './sort';
import { filtersValuesToQueryParams } from './filter';
import { QueryParams } from 'redux-connected';

export const tableDataToQueryParams = (tableData: TableData, page: number, itemsPerPage: number): QueryParams => {
    return {
        _page: page,
        _limit: itemsPerPage,
        ...searchToQueryParams(tableData.search),
        ...sortToQueryParams(tableData.sortOrder),
        ...filtersValuesToQueryParams(tableData.currentFilters),
    };
};
