import {WizardStepComponent} from "./WizardStepComponent";
import {AzureAuthComponent} from "./AzureAuthComponent";
import {DockerAuthComponent} from "./DockerAuthComponent";
import {authenticateAzure, authenticateDocker} from "../statemanagement/actions/authActions";
import {Wizard} from "react-use-wizard";
import * as React from "react";
import {
    DockerAuthConsumer,
    DockerAuthContext
} from "../statemanagement/contexts/DockerAuthContext";
import {useContext} from "react";
import {AzureAuthContext, AzureAuthConsumer} from "../statemanagement/contexts/AzureAuthContext";
import {DockerAuthenticationData} from "../statemanagement/types";

export const AuthenticationStep = () => {
    const isDockerDataNonEmpty = (dockerData: DockerAuthenticationData) => {
        return Object.values(dockerData).every(x => (x !== ''));
    }
    return (
        <AzureAuthConsumer>
            {azureAuthContext => azureAuthContext &&
                <DockerAuthConsumer>
                    {dockerContext => dockerContext &&
                        <WizardStepComponent components={[<AzureAuthComponent/>, <DockerAuthComponent/>]}
                                             title="Step 1/3: Authentication"
                                             nextEnabled={azureAuthContext.azureState.azureToken != ""
                                             && isDockerDataNonEmpty(dockerContext.dockerState)}
                                             nextOnClick={() => console.log("test")
                                             }/>}
                </DockerAuthConsumer>}
        </AzureAuthConsumer>)
        ;
}