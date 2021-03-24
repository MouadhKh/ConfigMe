import {AzureAuthenticationData, DockerAuthenticationData} from "../types";
import {AUTHENTICATE_AZURE, AUTHENTICATE_DOCKER} from "./actionTypes";

export const authenticateDocker = (auth: DockerAuthenticationData) => {
    return {
        type: AUTHENTICATE_DOCKER,
        payload: {
            dockerUsername: auth.dockerUsername,
            dockerPassword: auth.dockerPassword,
            dockerHubName: auth.dockerHubName
        }
    }
}
export const authenticateAzure = (auth: AzureAuthenticationData) => {
    return {
        type: AUTHENTICATE_AZURE,
        payload: {
            azureToken: auth.azureToken,
        }
    }
}