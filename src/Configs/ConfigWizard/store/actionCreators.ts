import {ActionCreator} from "redux";
import {AUTHENTICATE_AZURE, AUTHENTICATE_DOCKER} from "./actionTypes";
import {
    AzureAuthenticationAction,
    DockerAuthenticationAction,
    DockerAuthenticationDispatchType,
    IDockerAuthentication
} from "./types";

export function authenticateDocker(auth: IDockerAuthentication): ActionCreator<DockerAuthenticationAction> {
    const action: DockerAuthenticationAction = {
        type: AUTHENTICATE_DOCKER,
        authentication: auth,
    }
    return (dispatch: DockerAuthenticationDispatchType) => dispatch(action);
}

export const authenticateAzure = (token: string): AzureAuthenticationAction => {
    return {
        type: AUTHENTICATE_AZURE,
        payload: {token: token}
    };
}