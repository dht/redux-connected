import { tableDataToQueryParams } from '../../utils/query';
import { sortItems } from '../../utils/sort';
import { searchItems } from '../../utils/search';
import { filterItems } from '../../utils/filter';
import { SortOrders } from '../../types/types';
import { useCounter, useMount, useSetState } from 'react-use';
import { useDispatch, useSelector } from 'react-redux';
import { FilterValues } from '../../types/types';
import { useCallback } from 'react';

type useTableStateOptions = {
    itemsPerPage?: number;
};

export type TableData = {
    currentFilters: FilterValues;
    hasNextPage: boolean;
    isNextPageLoading: boolean;
    search: string;
    showFilter: boolean;
    sortOrder: SortOrders;
};

type TableMethods = {
    setCurrentFilters: (value: FilterValues) => void;
    setHasNextPage: (value: boolean) => void;
    setIsNextPageLoading: (value: boolean) => void;
    setSearch: (value: string) => void;
    toggleFilter: () => void;
    setSortOrder: (value: SortOrders) => void;
    loadNextPage: (startIndex: number, stopIndex: number) => Promise<any>;
};

type useTableStateReturn = [
    items: any[], //
    data: TableData,
    methods: TableMethods
];

export function useTableState(
    actions: any,
    selector: any,
    options: useTableStateOptions
) {
    const dispatch = useDispatch();
    const { itemsPerPage = 50 } = options;
    const [page, { inc: incPage, reset: resetPage }] = useCounter(1);
    const [state, setState] = useSetState<TableData>({
        search: '',
        sortOrder: {},
        showFilter: true,
        currentFilters: {},
        isNextPageLoading: false,
        hasNextPage: true,
    });

    useMount(() => {
        setTimeout(() => {
            loadPage(false, {});
        });
    });

    const rawItems = useSelector(selector) as any[];
    const items = filterItems(
        searchItems(rawItems, state.search),
        state.currentFilters
    );
    sortItems(items, state.sortOrder);

    const getState = useCallback(() => {
        return state;
    }, [state]);

    const loadPage = useCallback(
        async (reset: boolean, change: any) => {
            let _page = page;
            const _state = { ...state, ...change };

            if (reset) {
                resetPage();
                setState({ hasNextPage: true });
                _page = 1;
            }

            setState({ isNextPageLoading: true });
            const queryParams = tableDataToQueryParams(
                _state,
                _page,
                itemsPerPage
            );
            const response = await dispatch(actions.get(queryParams));
            const { data = [] } = response || {};
            setState({ isNextPageLoading: false });

            const possiblyMore = data.length === itemsPerPage;

            if (possiblyMore) {
                incPage();
            }

            if (!possiblyMore) {
                setState({ hasNextPage: false });
            }
        },
        [page, state, getState]
    );

    const setCurrentFilters = useCallback(
        (value: FilterValues) => {
            const change = { currentFilters: value };
            setState(change);
            loadPage(true, change);
        },
        [loadPage]
    );

    const setSearch = useCallback(
        (value: string) => {
            const change = { search: value };
            setState(change);
            loadPage(true, change);
        },
        [loadPage]
    );

    const setSortOrder = useCallback(
        (value: SortOrders) => {
            const change = { sortOrder: value };
            setState(change);
            loadPage(true, change);
        },
        [loadPage]
    );

    const loadNextPage = useCallback(
        async (_startIndex: number, _stopIndex: number) => {
            await loadPage(false, {});
        },
        [loadPage]
    );

    const setHasNextPage = useCallback((value: boolean) => {
        setState({ hasNextPage: value });
    }, []);

    const setIsNextPageLoading = useCallback((value: boolean) => {
        setState({ isNextPageLoading: value });
    }, []);

    const toggleFilter = useCallback(() => {
        setState({ showFilter: !state.showFilter });
    }, [state]);

    const data: TableData = {
        search: state.search,
        sortOrder: state.sortOrder,
        showFilter: state.showFilter,
        currentFilters: state.currentFilters,
        isNextPageLoading: state.isNextPageLoading,
        hasNextPage: state.hasNextPage,
    };

    const methods: TableMethods = {
        setCurrentFilters,
        setSearch,
        setSortOrder,
        loadNextPage,
        setHasNextPage,
        setIsNextPageLoading,
        toggleFilter,
    };

    return [items, data, methods] as useTableStateReturn;
}
