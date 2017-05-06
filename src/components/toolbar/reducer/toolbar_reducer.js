import {
    SET_VARIABLES,
    NEXT_STEP,
    PREV_STEP
} from "../action_types/toolbar_types";

const initialState = {
    a: 0,
    b: 0,
    step: 1
};

export function ToolbarReducer(state = initialState, action) {
    switch (action.type) {
        case SET_VARIABLES:
            return { ...state, ...action.payload };
        case NEXT_STEP:
            return { ...state, ...action.payload };
        case PREV_STEP:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}
