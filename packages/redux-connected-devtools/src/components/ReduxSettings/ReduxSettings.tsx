import * as React from 'react';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogType,
    DialogFooter,
    DefaultButton,
    Checkbox,
    Stack,
    Dropdown,
    IDropdownOption,
} from '@fluentui/react';
import { findPreset, readingsFilters, Preset, presets, ReadingsFilter } from '../../data/reduxFilterOptions';
import cssPrefix from '../prefix';

export type SavedFilters = Record<string, boolean>;

type ReduxSettingsProps = {
    filters?: SavedFilters;
    setFilters(filters: SavedFilters): void;
    onDismiss(): void;
};

export function ReduxSettings(props: ReduxSettingsProps) {
    const { filters, setFilters } = props;
    const [selectedPreset, setSelectedPreset] = useState<string | number>();

    useEffect(() => {
        refreshPreset(filters || {});
    }, [filters]);

    function refreshPreset(newFilters: SavedFilters) {
        const preset = findPreset(newFilters);
        setSelectedPreset(preset.key);
    }

    function onToggle(id: string, isChecked?: boolean) {
        if (typeof isChecked !== 'undefined') {
            const newFilters = { ...filters, [id]: isChecked };
            setFilters(newFilters);
        }
    }

    const onPresetChange = (_event?: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
        const preset = item as Preset;
        const { isCustom, selectedItems = [] } = preset || {};

        if (item) {
            setSelectedPreset(item.key);
        }

        if (isCustom) return;

        const newFilters = selectedItems.reduce(
            (output, key) => ({
                ...output,
                [key]: true,
            }),
            {},
        );

        setFilters(newFilters);
    };

    function renderCheckbox(option: ReadingsFilter) {
        const { id, label } = option;

        const isChecked = (filters || {})[id];

        return (
            <Checkbox
                key={id + isChecked}
                label={label}
                checked={isChecked}
                onChange={(_ev, isChecked?: boolean) => onToggle(id, isChecked)}
            />
        );
    }

    return (
        <div className={`${cssPrefix}ReduxSettings-container`}>
            <Dialog
                minWidth={400}
                onDismiss={props.onDismiss}
                hidden={false}
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    showCloseButton: true,
                    title: 'Filter Actions',
                    className: `${cssPrefix}ReduxSettings-container`,
                }}
                modalProps={{
                    isBlocking: false,
                }}
            >
                <div>
                    <Dropdown
                        selectedKey={selectedPreset}
                        onChange={onPresetChange}
                        placeholder="Load a preset"
                        options={presets}
                    />
                </div>
                <div className="row">
                    <Stack tokens={{ childrenGap: 10 }}>
                        {readingsFilters.filter((option) => option.isShow).map((option) => renderCheckbox(option))}
                    </Stack>
                    <Stack tokens={{ childrenGap: 10 }}>
                        {readingsFilters.filter((option) => !option.isShow).map((option) => renderCheckbox(option))}
                    </Stack>
                </div>
                <DialogFooter>
                    <DefaultButton onClick={props.onDismiss} text="Close" />
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default ReduxSettings;
