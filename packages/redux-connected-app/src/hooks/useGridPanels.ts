import { Panel } from '../types';
import { useDictionary } from './useDictionary';

export function useGridPanels() {
    const [panels, setPanels] = useDictionary<Panel>();

    return [Object.values(panels)];
}
