import { useGridPanels } from '../../hooks/useGridPanels';
import './GridView.scss';
import { Icon } from '../Icon/Icon';
import { RefObject } from 'react';
import { Panel } from '../../types';

type GridViewProps = {
    gridRef: RefObject<HTMLDivElement>;
    onToggle: () => void;
    panels: Panel[];
};

export function GridView(props: GridViewProps) {
    const { panels } = props;

    return (
        <div className="GridView-container">
            {panels.map((panel) => (
                <div className="panel">panel</div>
            ))}
            <div className="actions">
                <Icon icon="edit" onClick={props.onToggle} />
            </div>
        </div>
    );
}

export default GridView;
