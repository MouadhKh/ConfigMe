import {Action} from "redux";
import {AUTHENTICATE_AZURE} from "./actionTypes";

//TODO : security issue here
interface IDockerAuthentication {
    dockerUsername: string
    dockerPassword: string
    dockerHubName: string
}


interface DockerAuthenticationState {
    docker: IDockerAuthentication;
}

interface AzureAuthenticationState {
    azureToken: string
}

interface AzureAuthenticationAction extends Action {
    type: string,
    payload: { token: string }
}

interface DockerAuthenticationAction {
    type: string
    authentication: IDockerAuthentication
}

type DockerAuthenticationDispatchType = (args: DockerAuthenticationAction) => DockerAuthenticationAction;
type AzureAuthenticationDispatchType = (args: AzureAuthenticationAction) => AzureAuthenticationAction;
