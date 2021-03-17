import * as React from "react"
import {ModeConsumer} from "../../statemanagement/contexts/ModeContext"
import {useEffect, useState} from "react";
import {BasicModeCreatePipeline} from "../basicModeComponents/BasicModeCreatePipeline";
import {getCurrentProjectName} from "../../../../utils/ProjectUtils";
import {DockerAuthConsumer,} from "../../statemanagement/contexts/DockerAuthContext";
import {AzureAuthConsumer} from "../../statemanagement/contexts/AzureAuthContext";
import {AdvancedPipelineCreation} from "../advancedModeComponents/AdvancedPipelineCreation";
import {RepositoriesConsumer} from "../../statemanagement/contexts/RepositoriesContext";

export const CreatePipelinesStep = () => {
    const [projectName, setProjectName] = useState("");
    useEffect(() => {
        getCurrentProjectName().then(project => setProjectName(project));
    }, []);
    const renderCreatePipelineComponent = (modeContext: any, dockerContext: any, azureContext: any, repositoriesContext: any) => {
        if (modeContext.modeState.mode === "BASIC") {
            return <div>{projectName !== "" && <BasicModeCreatePipeline projectName={projectName}
                                                                        dockerEndpoint={dockerContext.dockerState.dockerHubName}
                                                                        azureToken={azureContext.azureState.azureToken}/>}
            </div>
        }
        return (<>
            <b>Repository
                : <i>{repositoriesContext.repositoriesState.baseContainerRepository}</i></b>
            <AdvancedPipelineCreation repositoryName={repositoriesContext.repositoriesState.baseContainerRepository}
                                      dockerEndpoint={dockerContext.dockerState.dockerHubName}
                                      azureToken={azureContext.azureState.azureToken}/>
            <hr className="mt-3 mb-3"/>
            <b>Repository : <i>{repositoriesContext.repositoriesState.mainRepository}</i></b>
            <AdvancedPipelineCreation repositoryName={repositoriesContext.repositoriesState.mainRepository}
                                      dockerEndpoint={dockerContext.dockerState.dockerHubName}
                                      azureToken={azureContext.azureState.azureToken}/>
        </>);
    }
    return (
        <ModeConsumer>{modeCtx => modeCtx &&
            <AzureAuthConsumer>
                {azureCtx => azureCtx &&
                    <DockerAuthConsumer>
                        {dockerCtx => dockerCtx &&
                            <RepositoriesConsumer>
                                {repositoriesCtx => repositoriesCtx &&
                                    renderCreatePipelineComponent(modeCtx, dockerCtx, azureCtx, repositoriesCtx)
                                }
                            </RepositoriesConsumer>}
                    </DockerAuthConsumer>}
            </AzureAuthConsumer>}
        </ModeConsumer>
    )
}