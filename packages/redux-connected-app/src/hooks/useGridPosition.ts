import { RefObject, useCallback, useState } from 'react';
import { GridOptions, GridPosition } from '../types';
import { useBoundingBox } from './useBoundingBox';
import { useListener } from './useListener';
import { useThrottle } from './useThrottle';

const THROTTLE_FOR_MOUSE_MOVE = 50;

export function useGridPosition(
    ref: RefObject<HTMLDivElement>,
    gridOptions: GridOptions
) {
    const [boundingBox] = useBoundingBox(ref);
    const [gridPosition, setGridPosition] = useState<GridPosition>();

    const calculatePosition = useCallback(
        (ev: MouseEvent) => {
            if (!boundingBox) return;

            const { clientX, clientY } = ev;
            const top = clientY - boundingBox.top;
            const left = clientX - boundingBox.left;

            const x = Math.ceil(left / gridOptions.cellWidth);
            const y = Math.ceil(top / gridOptions.cellHeight);

            setGridPosition({
                x,
                y,
                pixels: {
                    top,
                    left,
                    absoluteTop: clientY,
                    absoluteLeft: clientX,
                },
            });
        },
        [boundingBox, gridOptions]
    );

    const onMove = useThrottle(calculatePosition, THROTTLE_FOR_MOUSE_MOVE);
    useListener('mousemove', ref, onMove);

    return [gridPosition];
}
