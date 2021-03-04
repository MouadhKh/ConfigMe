import {AzureAuthConsumer} from "../../statemanagement/contexts/AzureAuthContext";
import {RepositoriesConsumer} from "../../statemanagement/contexts/RepositoriesContext";
import * as React from "react";
import {DockerManagementComponent} from "../DockerManagementComponent";

export const ManageDockerStep = () => {

    // const getActualRepository = (repositoryState: RepositoriesData) => {
    //     if (currentRepository === "MAIN")
    //         return repositoryState.mainRepository
    //     return repositoryState.baseContainerRepository;
    // }
    return (
        <AzureAuthConsumer>{azureAuthCtx => azureAuthCtx &&
            <RepositoriesConsumer>
                {repositoriesCtx => repositoriesCtx &&
                    <>
                        <h4 className="mt-2 mb-4"><b>Base
                            Container: {repositoriesCtx.repositoriesState.baseContainerRepository}</b></h4>
                        <DockerManagementComponent azureToken={azureAuthCtx.azureState.azureToken}
                                                   repositoryName={repositoriesCtx.repositoriesState.baseContainerRepository}/>
                        <h4 className="mt-2 mb-4"><b>Main
                            Repository: {repositoriesCtx.repositoriesState.mainRepository}</b>
                        </h4>
                        <DockerManagementComponent azureToken={azureAuthCtx.azureState.azureToken}
                                                   repositoryName={repositoriesCtx.repositoriesState.mainRepository}/>
                    </>}
            </RepositoriesConsumer>}
        </AzureAuthConsumer>);
}