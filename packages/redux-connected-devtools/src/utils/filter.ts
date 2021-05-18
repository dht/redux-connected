import { Reading } from 'redux-connected';
import { ApiInfoPerType } from 'redux-store-generator';
import { IncludePredicate, ExcludePredicate } from '../data/reduxFilterOptions';
import { ReadingsFilter, readingsFilters } from '../data/reduxFilterOptions';
import { SavedFilters } from '../components/ReduxSettings/ReduxSettings';

export const filterReadings = (readings: Reading[], filters: SavedFilters, apiInfo: ApiInfoPerType): Reading[] => {
    const includes = [] as IncludePredicate[];
    const excludes = [] as ExcludePredicate[];

    const checkedFilters = Object.keys(filters)
        .filter((key) => filters[key])
        .sort();

    checkedFilters.forEach((filterId) => {
        const filter = readingsFilters.find((f: ReadingsFilter) => f.id === filterId);

        if (filter) {
            if (filter.include) {
                includes.push(filter.include);
            }
            if (filter.exclude) {
                excludes.push(filter.exclude);
            }
        }
    });

    return [...readings].filter((reading: Reading) => {
        return (
            includes.some((include) => include(reading, apiInfo)) &&
            !excludes.some((exclude) => exclude(reading, apiInfo))
        );
    });
};
