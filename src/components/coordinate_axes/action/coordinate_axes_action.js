import {
    DRAW_ELLIPTIC_PARABOLOID,
    DRAW_LEVEL_SURFACE,
    DRAW_PROJECTION
} from "../action_types/coordinate_axes_types";

export const drawEllipticParaboloid = (a, b) => ({
    type: DRAW_ELLIPTIC_PARABOLOID,
    payload: { a, b }
});

export const drawLevelSurface = (c) => ({
    type: DRAW_LEVEL_SURFACE,
    payload: { c }
});

export const drawProjection = () => ({
    type: DRAW_PROJECTION
});
