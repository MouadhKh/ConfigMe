import {Mode} from "../types";
import {CHANGE_MODE} from "./actionTypes";

export const changeMode = (mode: Mode) => {
    return {
        type: CHANGE_MODE,
        payload: {
            mode: mode.mode
        }
    }
}