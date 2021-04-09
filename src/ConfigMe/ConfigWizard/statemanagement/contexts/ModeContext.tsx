import * as React from "react";
import {useReducer} from "react";
import {Mode, ModeDispatch} from "../types";
import {modeReducer} from "../reducers/modeReducer";

const initialMode = {
    mode: "BASIC"
};
export const ModeContext = React.createContext<{ modeState: Mode; modeDispatch: ModeDispatch }>
({modeState: initialMode, modeDispatch: () => null});

export const ModeProvider = ({children}: { children: JSX.Element }) => {
    const [state, dispatch] = useReducer(modeReducer, initialMode);
    return (
        <ModeContext.Provider value={{modeState: state, modeDispatch: dispatch}}>
            {children}
        </ModeContext.Provider>
    );
}
export const ModeConsumer = ModeContext.Consumer;
