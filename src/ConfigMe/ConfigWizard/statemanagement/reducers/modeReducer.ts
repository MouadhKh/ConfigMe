import {Mode, ModeAction} from "../types";
import {CHANGE_MODE} from "../actions/actionTypes";

export const modeReducer = (state: Mode, action: ModeAction) => {
    switch (action.type) {
        case CHANGE_MODE:
            return {
                ...state,
                mode: action.payload.mode
            }
        default:
            return state;
    }
}