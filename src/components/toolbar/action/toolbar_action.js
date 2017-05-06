import {
    SET_VARIABLES,
    NEXT_STEP,
    PREV_STEP
} from "../action_types/toolbar_types";

export const setVariables = (variables) => ({
    type: SET_VARIABLES,
    payload: { ...variables }
});

export const nextStep = (step) => ({
    type: NEXT_STEP,
    payload: {
        step: ++step
    }
});

export const prevStep = (step) => ({
    type: PREV_STEP,
    payload: {
        step: --step
    }
});
