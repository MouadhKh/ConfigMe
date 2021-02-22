import {AUTHENTICATE_AZURE, AUTHENTICATE_DOCKER} from "../actionTypes";
import {
    AzureAuthenticationAction,
    AzureAuthenticationState,
    DockerAuthenticationAction,
    DockerAuthenticationState
} from "../types";

const initialAzureAuthenticationState: AzureAuthenticationState = {
    azureToken: ""
}

const initialDockerAuthenticationState: DockerAuthenticationState = {
    docker: {
        dockerUsername: "",
        dockerPassword: "",
        dockerHubName: ""
    }
}
export const azureAuthReducer = (state: AzureAuthenticationState = initialAzureAuthenticationState, action: AzureAuthenticationAction) => {
    switch (action.type) {
        case AUTHENTICATE_AZURE:
            return {...state, azureToken: action.payload.token};
        default:
            return state;
    }
}
export const dockerAuthReducer = (state: DockerAuthenticationState = initialDockerAuthenticationState, action: DockerAuthenticationAction) => {
    switch (action.type) {
        case AUTHENTICATE_DOCKER:
            return {...state, docker: action.authentication};
        default:
            return state;
    }
}