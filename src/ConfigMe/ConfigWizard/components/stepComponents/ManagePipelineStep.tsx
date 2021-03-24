import {AzureAuthConsumer} from "../../statemanagement/contexts/AzureAuthContext";
import {RepositoriesConsumer} from "../../statemanagement/contexts/RepositoriesContext";
import * as React from "react";
import {AdvancedPipelineManagementComponent} from "../advancedModeComponents/AdvancedPipelineManagementComponent";
import {Accordion, Card} from "react-bootstrap";
import {BasicModePipelineManagementComponent} from "../basicModeComponents/BasicModePipelineManagementComponent";
import {useEffect, useState} from "react";
import {getCurrentProjectName} from "../../../../utils/ProjectUtils";
import {DockerAuthConsumer} from "../../statemanagement/contexts/DockerAuthContext";
import {ModeConsumer} from "../../statemanagement/contexts/ModeContext";
import BasicModeUtility from "../../../../utils/basicModeUtils/BasicModeUtility";
import {BLUE} from "../../styleConstants";

/**
 * Manage pipeline files
 * Basic Mode : Auto replace Placeholders in pipeline files
 * Advanced Mode : Open FileEditor to edit and push the changes on pipeline files
 */
export const ManagePipelineStep = () => {
    const [projectName, setProjectName] = useState("");
    useEffect(() => {
        getCurrentProjectName().then(project => setProjectName(project));
    }, []);

    return (
        <ModeConsumer>
            {modeCtx => modeCtx &&
                <AzureAuthConsumer>
                    {azureAuthCtx => azureAuthCtx &&
                        <DockerAuthConsumer>
                            {dockerAuthCtx => dockerAuthCtx &&
                                <RepositoriesConsumer>
                                    {repositoriesCtx => repositoriesCtx &&
                                        <Accordion defaultActiveKey="0">
                                            <Card
                                                className={BasicModeUtility.getVisibility(modeCtx.modeState.mode)}>
                                                <Accordion.Toggle as={Card.Header}
                                                                  eventKey="0"> <i style={BLUE}>Basic</i>
                                                </Accordion.Toggle>
                                                <Accordion.Collapse eventKey="0">
                                                    <Card.Body>
                                                        {projectName !== "" &&
                                                        <BasicModePipelineManagementComponent
                                                            repositoryNames={["Base-Container", projectName]}
                                                            dockerUser={dockerAuthCtx.dockerState.dockerUsername}
                                                            dockerRegistry={dockerAuthCtx.dockerState.dockerHubName}
                                                            azureToken={azureAuthCtx.azureState.azureToken}/>}
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                            <Card>
                                                <Accordion.Toggle as={Card.Header}
                                                                  eventKey="1">
                                                    <i style={BLUE}>Advanced</i>
                                                </Accordion.Toggle>
                                                <Accordion.Collapse eventKey="1">
                                                    <Card.Body>
                                                        <Card body className="m-2">
                                                            <b className="float-left mb-4"><i>Base
                                                                Container: {repositoriesCtx.repositoriesState.baseContainerRepository}</i>
                                                            </b>
                                                            <AdvancedPipelineManagementComponent
                                                                azureToken={azureAuthCtx.azureState.azureToken}
                                                                repositoryName={repositoriesCtx.repositoriesState.baseContainerRepository}/>
                                                        </Card>
                                                        <Card body className="m-2">
                                                            <b className=" float-left mb-4">
                                                                <i>Main
                                                                    Repository: {repositoriesCtx.repositoriesState.mainRepository}</i>
                                                            </b>
                                                            <AdvancedPipelineManagementComponent
                                                                azureToken={azureAuthCtx.azureState.azureToken}
                                                                repositoryName={repositoriesCtx.repositoriesState.mainRepository}/>
                                                        </Card>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        </Accordion>}
                                </RepositoriesConsumer>}
                        </DockerAuthConsumer>}
                </AzureAuthConsumer>}
        </ModeConsumer>
    );
}