import * as React from "react";
import {azureAuthReducer} from "../reducers/authReducer";
import {useReducer} from "react";
import {AzureAuthenticationData, AzureAuthenticationDispatch, Mode, ModeDispatch} from "../types";
import {ContextDevTool} from "react-context-devtool";
import {modeReducer} from "../reducers/modeReducer";

const initialMode = {
    mode: "BASIC"
};
export const ModeContext = React.createContext<{ modeState: Mode; modeDispatch:ModeDispatch }>
({modeState: initialMode, modeDispatch: () => null});

export const ModeProvider = ({children}: { children: JSX.Element }) => {
    const [state, dispatch] = useReducer(modeReducer, initialMode);
    return (
        <ModeContext.Provider value={{modeState: state, modeDispatch: dispatch}}>
            {children}
            <ContextDevTool context={ModeContext} id="modeCtx"
                            displayName="Mode Context"/>
        </ModeContext.Provider>
    );
}
export const ModeConsumer = ModeContext.Consumer;
