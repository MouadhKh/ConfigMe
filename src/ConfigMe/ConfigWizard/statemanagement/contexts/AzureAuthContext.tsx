import * as React from "react";
import {azureAuthReducer} from "../reducers/authReducer";
import {useReducer} from "react";
import {AzureAuthenticationData, AzureAuthenticationDispatch} from "../types";

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
        </AzureAuthContext.Provider>
    );
}
export const AzureAuthConsumer = AzureAuthContext.Consumer;
