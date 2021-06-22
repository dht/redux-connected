export type Dimension = {
    x: number;
    y: number;
};

export type BoxSizes = Dimension[];

export type Panel = {
    id: string;
    title: string;
    description: string;
    dimension: Dimension;
    component?: JSX.Element;
};

export enum Mode {
    VIEW = 'VIEW',
    EDIT = 'EDIT',
}

export type GridOptions = {
    cellWidth: number;
    cellHeight: number;
};

export type BoundingBox = {
    top: number;
    left: number;
    width: number;
    height: number;
};

export type GridPosition = {
    x: number;
    y: number;
    pixels: {
        top: number;
        left: number;
        absoluteTop: number;
        absoluteLeft: number;
    };
};
