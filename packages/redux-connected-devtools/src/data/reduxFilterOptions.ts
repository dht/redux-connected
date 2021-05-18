import { Reading } from 'redux-connected';
import { ApiInfo, ApiInfoPerType } from 'redux-store-generator';

export type IncludePredicate = (
    reading: Reading,
    apiInfo?: ApiInfoPerType
) => boolean | undefined;

export type ExcludePredicate = (
    reading: Reading,
    apiInfo?: ApiInfoPerType
) => boolean | undefined;

export interface ReadingsFilter {
    id: string;
    label: string;
    isShow?: boolean;
    include?: IncludePredicate;
    exclude?: ExcludePredicate;
}

export interface Preset {
    key: string;
    text: string;
    isCustom?: boolean;
    selectedItems?: string[];
}

export const readingsFilters: ReadingsFilter[] = [
    {
        id: 'root',
        label: 'Show root',
        isShow: true,
        include: (reading: Reading) => {
            const { action } = reading;
            return action['@@redux-store-generator/AUTO_GENERATED_ACTION'];
        },
    },
    {
        id: 'apiState',
        label: 'Show API state',
        isShow: true,
        include: (reading: Reading) => {
            const { action } = reading;
            return action['@@redux-connected/STATUS_ACTION'];
        },
    },
    {
        id: 'apiConfig',
        label: 'Show API config',
        isShow: true,
        include: (reading: Reading) => {
            const { action } = reading;
            return action['@@redux-connected/CONFIG_ACTION'];
        },
    },
    {
        id: 'sagasMessages',
        label: 'Show sagas messages',
        isShow: true,
        include: (reading: Reading) => {
            const { action } = reading;
            return (
                action['@@redux-saga/SAGA_ACTION'] &&
                action.type !== 'LOG' &&
                !action['@@redux-store-generator/AUTO_GENERATED_ACTION']
            );
        },
    },
    {
        id: 'globalStats',
        label: 'Show global stats',
        isShow: true,
        include: (reading: Reading) => {
            const { action } = reading;
            return action['@@redux-connected/GLOBAL_STATS_ACTION'];
        },
    },
    {
        id: 'globalSettings',
        label: 'Show global settings',
        isShow: true,
        include: (reading: Reading) => {
            const { action } = reading;
            return action['@@redux-connected/GLOBAL_SETTINGS_ACTION'];
        },
    },
    {
        id: 'sagasInfo',
        label: 'Show sagas info',
        isShow: true,
        include: (reading: Reading) => {
            const { action } = reading;
            return action['@@redux-connected/SAGA_ACTION'];
        },
    },
    {
        id: 'log',
        label: 'Show log',
        isShow: true,
        include: (reading: Reading) => {
            const { action } = reading;
            return action.type === 'LOG';
        },
    },
    {
        id: 'hideGet',
        label: 'Hide get',
        exclude: (reading: Reading, apiInfo: ApiInfoPerType = {}) => {
            const { action } = reading;
            const info: ApiInfo = apiInfo[action.type];
            return info?.isGet;
        },
    },
    {
        id: 'hidePatch',
        label: 'Hide patch',
        exclude: (reading: Reading, apiInfo: ApiInfoPerType = {}) => {
            const { action } = reading;
            const info: ApiInfo = apiInfo[action.type];
            return info?.verb === 'patch';
        },
    },
    {
        id: 'hideSetAll',
        label: 'Hide setAll',
        exclude: (reading: Reading, apiInfo: ApiInfoPerType = {}) => {
            const { action } = reading;
            const info: ApiInfo = apiInfo[action.type];
            return info?.verb === 'setAll';
        },
    },
    {
        id: 'hideSet',
        label: 'Hide set',
        exclude: (reading: Reading, apiInfo: ApiInfoPerType = {}) => {
            const { action } = reading;
            const info: ApiInfo = apiInfo[action.type];
            return info?.verb === 'set';
        },
    },
    {
        id: 'hideDelete',
        label: 'Hide delete',
        exclude: (reading: Reading, apiInfo: ApiInfoPerType = {}) => {
            const { action } = reading;
            const info: ApiInfo = apiInfo[action.type];
            return info?.verb === 'delete';
        },
    },
    {
        id: 'hidePush',
        label: 'Hide push',
        exclude: (reading: Reading, apiInfo: ApiInfoPerType = {}) => {
            const { action } = reading;
            const info: ApiInfo = apiInfo[action.type];
            return info?.verb === 'push';
        },
    },
    {
        id: 'hidePop',
        label: 'Hide pop',
        exclude: (reading: Reading, apiInfo: ApiInfoPerType = {}) => {
            const { action } = reading;
            const info: ApiInfo = apiInfo[action.type];
            return info?.verb === 'pop';
        },
    },
    {
        id: 'hideClear',
        label: 'Hide clear',
        exclude: (reading: Reading, apiInfo: ApiInfoPerType = {}) => {
            const { action } = reading;
            const info: ApiInfo = apiInfo[action.type];
            return info?.verb === 'clear';
        },
    },
];

export const presets: Preset[] = [
    {
        key: 'custom',
        text: 'Custom',
        isCustom: true,
    },
    {
        key: 'default',
        text: 'Default',
        selectedItems: ['root'].sort(),
    },
    {
        key: 'connected',
        text: 'Connected',
        selectedItems: [
            'apiState',
            'apiConfig',
            'sagasMessages',
            'globalStats',
            'globalSettings',
            'log',
            'sagasInfo',
        ].sort(),
    },
    {
        key: 'get',
        text: 'GET',
        selectedItems: [
            'root',
            'hidePatch',
            'hideSetAll',
            'hideSet',
            'hideDelete',
            'hidePush',
            'hidePop',
            'hideClear',
        ].sort(),
    },
    {
        key: 'all',
        text: 'All',
        selectedItems: [
            'root',
            'apiState',
            'apiConfig',
            'sagasMessages',
            'globalStats',
            'globalSettings',
            'sagasInfo',
        ].sort(),
    },
];

const sameArray = (array1: any[], array2: any[]) => {
    const sortedArray1 = [...array1].sort();
    const sortedArray2 = [...array2].sort();

    return (
        sortedArray1.length === sortedArray2.length &&
        sortedArray1.every((value, index) => value === sortedArray2[index])
    );
};

export const findPreset = (filters: Record<string, boolean>): Preset => {
    const checkedFilters = Object.keys(filters)
        .filter((key) => filters[key])
        .sort();

    return (
        presets.find(
            (preset) =>
                preset && sameArray(preset.selectedItems || [], checkedFilters)
        ) || presets[0]
    );
};
