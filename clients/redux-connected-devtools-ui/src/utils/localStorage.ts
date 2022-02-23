import { arrangement1 } from '../data/panelsArrangements';

type Json = Record<string, any>;

const PANELS_KEYS = ['PANELS_', 'PANEL_', 'TASK_MANAGER_'];

const clearKey = (key: string) => {
    localStorage.removeItem(key);
};

const setKey = (key: string, value: string) => {
    localStorage.setItem(key, value);
};

const loadLocalStorage = (json: Json) => {
    Object.keys(json).forEach((key) => setKey(key, json[key]));
};

export const clearPanelData = () => {
    Object.keys(localStorage)
        .filter((key) => PANELS_KEYS.some((panelKey) => key.indexOf(panelKey) === 0))
        .forEach((key) => clearKey(key));
};

export const loadPanelsArrangement = () => {
    clearPanelData();
    loadLocalStorage(arrangement1);
    document.location.reload();
};
