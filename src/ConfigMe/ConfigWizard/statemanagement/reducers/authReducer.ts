import {AUTHENTICATE_AZURE, AUTHENTICATE_DOCKER} from "../actions/actionTypes";
import {
    AzureAuthenticationAction,
    AzureAuthenticationData,
    DockerAuthenticationAction,
    DockerAuthenticationData
} from "../types";

export const dockerAuthReducer = (state: DockerAuthenticationData, action:
    DockerAuthenticationAction) => {
    switch (action.type) {
        case AUTHENTICATE_DOCKER:
            return {
                ...state,
                dockerUsername: action.payload.dockerUsername,
                dockerPassword: action.payload.dockerPassword,
                dockerHubName: action.payload.dockerHubName
            }
        default:
            return state;
    }
}
export const azureAuthReducer = (state: AzureAuthenticationData, action: AzureAuthenticationAction) => {
    switch (action.type) {
        case AUTHENTICATE_AZURE:
            return {
                ...state,
                azureToken: action.payload.azureToken
            }
        default:
            return state;
    }
}