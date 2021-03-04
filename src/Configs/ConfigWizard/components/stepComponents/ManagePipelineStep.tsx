import {AzureAuthConsumer} from "../../statemanagement/contexts/AzureAuthContext";
import {RepositoriesConsumer} from "../../statemanagement/contexts/RepositoriesContext";
import * as React from "react";
import {PipelineManagementComponent} from "../PipelineManagementComponent";

export const ManagePipelineStep = () => {

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
                        <h3 className="mb-3"><b>Base
                            Container: {repositoriesCtx.repositoriesState.baseContainerRepository}</b></h3>
                        <PipelineManagementComponent azureToken={azureAuthCtx.azureState.azureToken}
                                                     repositoryName={repositoriesCtx.repositoriesState.baseContainerRepository}/>
                        <h3 className="mb-3"><b>Main Repository: {repositoriesCtx.repositoriesState.mainRepository}</b>
                        </h3>
                        <PipelineManagementComponent azureToken={azureAuthCtx.azureState.azureToken}
                                                     repositoryName={repositoriesCtx.repositoriesState.mainRepository}/>
                    </>}
            </RepositoriesConsumer>}
        </AzureAuthConsumer>);
}