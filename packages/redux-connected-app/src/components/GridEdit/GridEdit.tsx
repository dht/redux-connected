import { RefObject } from 'react';
import { useGridPanels } from '../../hooks/useGridPanels';
import './GridEdit.scss';
import {
    useGridCursorDraw,
    useGridCursorFixed,
} from '../../hooks/useGridCursor';
import { useState } from 'react';
// import { useGridCursor } from '../../hooks/useGridCursor.txt';
import { Icon } from '../Icon/Icon';
import { Panel } from '../../types';

type GridEditProps = {
    gridRef: RefObject<HTMLDivElement>;
    onToggle: () => void;
    panels: Panel[];
};

export function GridEdit(props: GridEditProps) {
    const ref = props.gridRef;
    const { panels } = props;
    const [fixedDimensions, setFixedDimensions] = useState({
        x: 10,
        y: 5,
    });
    const [cursorStyle, areaStyle] = useGridCursorFixed(
        ref,
        {
            cellWidth: 25,
            cellHeight: 25,
        },
        fixedDimensions
    );

    return (
        <>
            <div className="area" style={areaStyle}></div>
            <div className="cursor" style={cursorStyle}></div>
            {panels.map((panel) => (
                <div className="panel">panel</div>
            ))}

            <div className="actions">
                <Icon icon="list" />
                <Icon icon="brush" />
                <Icon icon="download" />
                <Icon icon="close" onClick={props.onToggle} />
            </div>
        </>
    );
}

export default GridEdit;
