import * as React from "react";
import {useReducer} from "react";
import {RepositoriesData, RepositoriesDispatch} from "../types";
import {repositoriesReducer} from "../reducers/repositoriesReducer";

const initialRepositoriesState = {
    baseContainerRepository: "",
    mainRepository: ""
};
export const RepositoriesContext = React.createContext<{ repositoriesState: RepositoriesData; repositoryDispatch: RepositoriesDispatch }>
({repositoriesState: initialRepositoriesState, repositoryDispatch: () => null});

export const RepositoriesProvider = ({children}: { children: JSX.Element }) => {
    const [state, dispatch] = useReducer(repositoriesReducer, initialRepositoriesState);
    return (
        <RepositoriesContext.Provider
            value={{repositoriesState: state, repositoryDispatch: dispatch}}>
            {children}
        </RepositoriesContext.Provider>
    );
}
export const RepositoriesConsumer = RepositoriesContext.Consumer;
