import * as React from 'react';
import { useCallback } from 'react';
import classnames from 'classnames';
import { FilterConfig, FilterOption, FilterValues } from '../../types/types';
import cssPrefix from '../prefix';

type FilterProps = {
    filters: FilterConfig[];
    currentFilters: FilterValues;
    onFilter?: (filterValues: FilterValues) => void;
    show?: boolean;
};

export function Filter(props: FilterProps) {
    const { filters, show, currentFilters } = props;

    const className = classnames(`${cssPrefix}Filter-container`, {
        show,
    });

    const toggle = useCallback(
        (filter: FilterConfig, option: FilterOption) => {
            const { allowMultiSelect } = filter;
            const filterValue = currentFilters[filter.key] || {};
            const { value = [] } = filterValue;

            let newOptions = [...value];

            if (value.includes(option)) {
                newOptions = newOptions.filter((o) => o.key !== option.key);
            } else {
                if (!allowMultiSelect) {
                    newOptions = [];
                }
                newOptions.push(option);
            }

            if (props.onFilter) {
                props.onFilter({
                    ...currentFilters,
                    [filter.key]: {
                        config: filter,
                        value: newOptions,
                    },
                });
            }
        },
        [currentFilters],
    );

    function renderOption(filter: FilterConfig, option: FilterOption) {
        const filterValue = currentFilters[filter.key] || {};
        const { value = [] } = filterValue;

        const isOn = value.includes(option);

        const className = classnames('link', {
            on: isOn,
        });

        return (
            <button className={className} key={option.key} onClick={() => toggle(filter, option)}>
                {option.title}
                <span className="material-icons icon">close</span>
            </button>
        );
    }

    function renderFilter(filter: FilterConfig) {
        const { key, title, options } = filter;

        return (
            <div className="filter" key={key}>
                <h2>{title}</h2>
                {options.map((option) => renderOption(filter, option))}
            </div>
        );
    }

    function renderFilters() {
        return filters.map((filter) => renderFilter(filter));
    }

    return (
        <div className={className}>
            <div className="filters">{renderFilters()}</div>
        </div>
    );
}

export default Filter;
