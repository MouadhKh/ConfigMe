import {AzureAuthConsumer} from "../../statemanagement/contexts/AzureAuthContext";
import {RepositoriesConsumer} from "../../statemanagement/contexts/RepositoriesContext";
import * as React from "react";
import {AdvancedDockerManagementComponent} from "../advancedModeComponents/AdvancedDockerManagementComponent";
import {Accordion, Card} from "react-bootstrap";
import {BasicModeDockerManagementComponent} from "../basicModeComponents/BasicModeDockerManagementComponent";
import {DockerAuthConsumer} from "../../statemanagement/contexts/DockerAuthContext";
import BasicModeUtility from "../../../../utils/BasicModeUtility";
import {ModeConsumer} from "../../statemanagement/contexts/ModeContext";
import {BLUE} from "../../styleConstants";

/**
 * Responsible for managing docker files
 */
export const ManageDockerStep = () => {

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
                                            <Card className={BasicModeUtility.getVisibility(modeCtx.modeState.mode)}>
                                                <Accordion.Toggle as={Card.Header} eventKey="0"> <i
                                                    style={BLUE}>Basic</i>
                                                </Accordion.Toggle>
                                                <Accordion.Collapse eventKey="0">
                                                    <Card.Body>
                                                        <BasicModeDockerManagementComponent
                                                            repositoryName={repositoriesCtx.repositoriesState.mainRepository}
                                                            dockerUser={dockerAuthCtx.dockerState.dockerUsername}
                                                            dockerRegistry={dockerAuthCtx.dockerState.dockerHubName}
                                                            azureToken={azureAuthCtx.azureState.azureToken}/>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                            <Card>
                                                <Accordion.Toggle as={Card.Header} eventKey="1">
                                                    <i style={BLUE}>Advanced</i>
                                                </Accordion.Toggle>
                                                <Accordion.Collapse eventKey="1">
                                                    <Card.Body>
                                                        <Card body className="m-2">
                                                            <b className="float-left mb-4"><i>Base
                                                                Container: {repositoriesCtx.repositoriesState.baseContainerRepository}</i>
                                                            </b>
                                                            <AdvancedDockerManagementComponent
                                                                azureToken={azureAuthCtx.azureState.azureToken}
                                                                repositoryName={repositoriesCtx.repositoriesState.baseContainerRepository}/>
                                                        </Card>
                                                        <Card body className="m-2">
                                                            <b className="float-left mb-4"><i>Main
                                                                Repository: {repositoriesCtx.repositoriesState.mainRepository}</i>
                                                            </b>
                                                            <AdvancedDockerManagementComponent
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
        </ModeConsumer>);
}