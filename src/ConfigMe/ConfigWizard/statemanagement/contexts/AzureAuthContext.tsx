import * as React from "react";
import {azureAuthReducer} from "../reducers/authReducer";
import {useReducer} from "react";
import {AzureAuthenticationData, AzureAuthenticationDispatch} from "../types";
import {ContextDevTool} from "react-context-devtool";

const initialAzureState = {
    azureToken: ""
};
export const AzureAuthContext = React.createContext<{ azureState: AzureAuthenticationData; azureDispatch: AzureAuthenticationDispatch }>
({azureState: initialAzureState, azureDispatch: () => null});

export const AzureAuthProvider = ({children}: { children: JSX.Element }) => {
    const [state, dispatch] = useReducer(azureAuthReducer, initialAzureState);
    return (
        <AzureAuthContext.Provider value={{azureState: state, azureDispatch: dispatch}}>
            {children}
            {/*TODO delete on production*/}
            <ContextDevTool context={AzureAuthContext} id="azureAuthCtx"
                            displayName="Azure Authentication Context"/>
        </AzureAuthContext.Provider>
    );
}
export const AzureAuthConsumer = AzureAuthContext.Consumer;
