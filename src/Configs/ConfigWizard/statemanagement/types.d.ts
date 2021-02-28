import {Dispatch} from "react";

interface AzureAuthenticationData {
    azureToken: string
}

interface DockerAuthenticationData {
    dockerUsername: string
    dockerPassword: string
    dockerHubName: string
}

export interface RepositoriesData {
    baseContainerRepository: string,
    mainRepository: string
}

export type AzureAuthenticationAction = {
    type: string,
    payload: {
        azureToken: string
    }
}
export type RepositoryAction = {
    type: string,
    payload: {
        repositoryType: string,
        repositoryName: string
    }
}

export type DockerAuthenticationAction =
    {
        type: string,
        payload:
            {
                dockerUsername: string
                dockerPassword: string
                dockerHubName: string
            }
    }

export type AzureAuthenticationDispatch = Dispatch<AzureAuthenticationAction>;
export type DockerAuthenticationDispatch = Dispatch<DockerAuthenticationAction>;
export type RepositoriesDispatch = Dispatch<RepositoryAction>;