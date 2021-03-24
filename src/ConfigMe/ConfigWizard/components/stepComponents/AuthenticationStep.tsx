import {WizardStepComponent} from "./WizardStepComponent";
import {AzureAuthComponent} from "../authComponents/AzureAuthComponent";
import {DockerAuthComponent} from "../authComponents/DockerAuthComponent";
import * as React from "react";
import {DockerAuthConsumer} from "../../statemanagement/contexts/DockerAuthContext";
import {AzureAuthConsumer} from "../../statemanagement/contexts/AzureAuthContext";
import {DockerAuthenticationData} from "../../statemanagement/types";

/**
 * Step responsible for :
 *  - Azure Authentication
 *  - Dockerhub authentication & Dockerhub endpoint creation
 * @constructor
 */
export const AuthenticationStep = () => {
    const isDockerDataNonEmpty = (dockerData: DockerAuthenticationData) => {
        return Object.values(dockerData).every(x => (x !== ''));
    }
    return (
        <AzureAuthConsumer>
            {azureAuthContext => azureAuthContext &&
                <DockerAuthConsumer>
                    {dockerContext => dockerContext &&
                        <WizardStepComponent components={[<AzureAuthComponent/>,
                            <DockerAuthComponent azureAuthorized={azureAuthContext.azureState.azureToken !== ""}
                                                 azureToken={azureAuthContext.azureState.azureToken}/>]}
                                             title="Step 1/5: Authentication"
                                             nextEnabled={azureAuthContext.azureState.azureToken != ""
                                             && isDockerDataNonEmpty(dockerContext.dockerState)}
                                             nextOnClick={() => console.log("test")
                                             }/>}
                </DockerAuthConsumer>}
        </AzureAuthConsumer>)
        ;
}