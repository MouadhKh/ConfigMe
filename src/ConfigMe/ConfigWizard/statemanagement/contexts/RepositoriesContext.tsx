import * as React from "react";
import {useReducer} from "react";
import {RepositoriesData, RepositoriesDispatch} from "../types";
import {ContextDevTool} from "react-context-devtool";
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
            {/*TODO delete on production*/}
            <ContextDevTool context={RepositoriesContext} id="repositoriesCtx"
                            displayName="Repositories Context"/>
        </RepositoriesContext.Provider>
    );
}
export const RepositoriesConsumer = RepositoriesContext.Consumer;
