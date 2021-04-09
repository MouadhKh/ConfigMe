import * as React from "react";
import {dockerAuthReducer} from "../reducers/authReducer";
import {useReducer} from "react";
import {
    DockerAuthenticationData,
    DockerAuthenticationDispatch
} from "../types";

const initialDockerState = {
    dockerUsername: "",
    dockerPassword: "",
    dockerHubName: ""
};
export const DockerAuthContext = React.createContext<{ dockerState: DockerAuthenticationData; dockerDispatch: DockerAuthenticationDispatch }>
({dockerState: initialDockerState, dockerDispatch: () => null});

export const DockerAuthProvider = ({children}: { children: JSX.Element }) => {
    const [state, dispatch] = useReducer(dockerAuthReducer, initialDockerState);
    return (
        <DockerAuthContext.Provider value={{dockerState: state, dockerDispatch: dispatch}}>
            {children}
        </DockerAuthContext.Provider>
    );
}
export const DockerAuthConsumer = DockerAuthContext.Consumer;
