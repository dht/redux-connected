import { RefObject, useEffect, useMemo, useState } from 'react';
import { Dimension, GridOptions, GridPosition } from '../types';
import { useGridPosition } from './useGridPosition';
import { useIsMouseDown } from './useMouseDown';
import * as CSS from 'csstype';

export enum Mode {
    DRAW = 'DRAW',
    FIXED = 'FIXED',
}

export function useGridCursorFixed(
    ref: RefObject<HTMLDivElement>,
    gridOptions: GridOptions,
    fixedDimesion?: Dimension
) {
    const [cursorCss, setCursorCss] = useState<CSS.Properties>({});
    const [areaCss, setAreaCss] = useState<CSS.Properties>({});
    const [position] = useGridPosition(ref, gridOptions);

    useEffect(() => {
        setCursorCss({
            gridArea: point(position?.x, position?.y),
            backgroundColor: 'rgba(21, 21, 30, 0.8)',
        });

        const gridArea = area(
            position?.x,
            position?.y,
            (position?.x || 0) + (fixedDimesion?.x || 0),
            (position?.y || 0) + (fixedDimesion?.y || 0)
        );

        setAreaCss({
            gridArea,
            opacity: fixedDimesion ? 0.3 : 0,
            backgroundColor: 'orange',
        });
    }, [position, fixedDimesion]);

    return [cursorCss, areaCss];
}

export function useGridCursorDraw(
    ref: RefObject<HTMLDivElement>,
    gridOptions: GridOptions
): [CSS.Properties, CSS.Properties] {
    const [cursorCss, setCursorCss] = useState<CSS.Properties>({});
    const [areaCss, setAreaCss] = useState<CSS.Properties>({});
    const [position] = useGridPosition(ref, gridOptions);
    const [startingPosition, setStartingPosition] = useState<GridPosition>();
    const isMouseDown = useIsMouseDown(ref, () => {
        setStartingPosition(position);
    });

    useEffect(() => {
        setCursorCss({
            gridArea: point(position?.x, position?.y),
            backgroundColor: 'rgba(21, 21, 30, 0.8)',
        });

        let gridArea;

        gridArea = area(
            startingPosition?.x,
            startingPosition?.y,
            position?.x,
            position?.y
        );

        setAreaCss({
            gridArea,
            opacity: isMouseDown ? 0.3 : 0,
            backgroundColor: 'orange',
        });
    }, [position, startingPosition, isMouseDown]);

    return [cursorCss, areaCss];
}

const point = (x?: number, y?: number) => {
    if (!x || !y) {
        return '';
    }

    return [y, x, y, x].join('/');
};

const area = (sx?: number, sy?: number, ex?: number, ey?: number) => {
    if (!sx || !sy || !ex || !ey) {
        return '';
    }

    return [sy, sx, ey + 1, ex + 1].join('/');
};
