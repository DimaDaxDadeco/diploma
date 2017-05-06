import {
    DRAW_ELLIPTIC_PARABOLOID,
    DRAW_LEVEL_SURFACE,
    DRAW_PROJECTION
} from "../action_types/coordinate_axes_types";

const initialState = {
    a: 0,
    b: 0,
    c: 0,
    projection: false,
};

export function CoordinateAxesReducer(state = initialState, action) {
    switch (action.type) {
        case DRAW_ELLIPTIC_PARABOLOID:
            return { ...state, ...action.payload };
        case DRAW_LEVEL_SURFACE:
            return { ...state, ...action.payload, projection: false };
        case DRAW_PROJECTION:
            return { ...state, projection: true };
        default:
            return state;
    }
}
