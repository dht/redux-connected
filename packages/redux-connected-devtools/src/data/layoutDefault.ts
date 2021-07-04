import { IPositionAndDimension } from 'igrid';

export const layout: Record<string, IPositionAndDimension> = {
    topLeft1: {
        dimension: { x: 13, y: 17 },
        position: { x: 2, y: 2 },
    },
    topLeft2: {
        dimension: { x: 13, y: 17 },
        position: { x: 16, y: 2 },
    },
    topRight2: {
        dimension: { x: 13, y: 17 },
        position: { x: 30, y: 2 },
    },
    topRight1: {
        dimension: { x: 13, y: 17 },
        position: { x: 44, y: 2 },
    },
    bottomLeft1: {
        dimension: { x: 13, y: 17 },
        position: { x: 2, y: 75 },
    },
    bottomLeft2: {
        dimension: { x: 13, y: 17 },
        position: { x: 16, y: 75 },
    },
    bottomRight2: {
        dimension: { x: 13, y: 17 },
        position: { x: 30, y: 75 },
    },
    bottomRight1: {
        dimension: { x: 13, y: 17 },
        position: { x: 44, y: 75 },
    },
    center1: {
        dimension: { x: 55, y: 33 },
        position: { x: 2, y: 20 },
    },
    center2: {
        dimension: { x: 55, y: 20 },
        position: { x: 2, y: 54 },
    },
};
