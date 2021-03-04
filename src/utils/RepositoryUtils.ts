//import { getClient } from "azure-devops-extension-api";
//import { GitRestClient } from "azure-devops-extension-api/Git";
//import * as SDK from "azure-devops-extension-sdk";
import axios from 'axios';
import {AUTH_HEADER, getAuthHeader} from "../auth";
import {getOrganizationName} from "./OrganizationUtils";
import {getCurrentProjectName} from "./ProjectUtils";

const ENDPOINT = "https://dev.azure.com/ORG_NAME/PROJECT_NAME/_apis/git/repositories?api-version=6.0";

/**
 * create multiple repositories on currentProject
 * @param url
 * @param repositoriesNames
 */
export async function createRepositories(organizationName: string, projectName: string, repositoriesNames: string[], azureToken: string) {
    return axios.all(repositoriesNames.map((repoName) => createRepository(organizationName, projectName, repoName, azureToken)));
}

/**
 * Create Repository on CURRENT project
 * The SDK variant is very bad documented.Couldn't get it to work
 * @param organizationName
 * @param projectId
 * @param repoName
 * @param skip
 */

export async function createRepository(organizationName: string, projectId: string, repoName: string, azureToken: string, skip: boolean = false) {
    //TODO delete the if
    if (skip) {
        return getRepositoryByName(repoName, azureToken);
    }
    let body = {
        name: repoName,
        project: {
            id: projectId
        }
    }
    const url = ENDPOINT.split("PROJECT_NAME").join(projectId).split("ORG_NAME").join(organizationName);
    const authHeader = getAuthHeader(azureToken);
    return axios.post(url, body, {headers: authHeader})
        .then((response) => {
            console.log(`Repo ${body.name} created successfully`)
            return response.data;
        }).catch(() => {
            console.log('url:' + url);
            console.log('header:' + authHeader.Authorization);
            console.log('body:' + body.project.id);
            console.log(`Error creating ${body.name}`)
        });

}


export function listRepositories(organizationName: string, projectName: string, azureToken: string) {
    const authHeader = getAuthHeader(azureToken);
    //TODO es muss einheitlich sein
    const url = ENDPOINT.split("PROJECT_NAME").join(projectName).split("ORG_NAME").join(organizationName);
    return axios.get(url, {headers: authHeader}).then(response => response.data.value).catch(err => "Error occured when fetching repositories" + err);
}

/**
 * Inefficient because we are listing all repo and extracting the one we need
 * There is no other option to get repositoryId by name
 * @param organizationName
 * @param projectName
 * @param repoName
 */
export async function getRepositoryByName(repoName: string, azureToken: string) {
    const organizationName = await getOrganizationName();
    const projectName = await getCurrentProjectName();
    return await listRepositories(organizationName, projectName, azureToken)
        .then((repositories: any[]) => {
            const foundRepo = repositories.filter(repo => repo.name === repoName);
            if (foundRepo.length > 0) {
                return foundRepo[0];
            } else {
                console.log("No repository found with this name " + repoName)
            }
        })
        .catch((err) => console.log("Error fetching repository id ", err))
}

/**
 * TODO : not working
 * At the moment we will use the static Books-API as source
 * sourceRef :The source ref to copy. For example, refs/heads/master.
 * targetRef : The target ref to update. For example, refs/heads/master.
 */
export async function copyRepository(targetOrganizationName: string, sourceProjectId: string, targetProjectId: string,
                                     targetRepoName: string, sourceRepositoryId: string, sourceRef: string, targetRef: string) {
    const url: string = `https://dev.azure.com/${targetOrganizationName}/${targetProjectId}/_apis/git/repositories/${targetRepoName}/forkSyncRequests?api-version=6.0-preview`
    const body = {
        source: {
            projectId: sourceProjectId,
            repositoryId: sourceRepositoryId
        },
        sourceToTargetRefs: {
            sourceRef: sourceRef,
            targetRef: targetRef
        }
    }

    return axios.post(url, body, {headers: AUTH_HEADER}).then((response) => {
        console.log("repo copied successfully:", response);
        return response;
    }).catch((err) => {
        console.log("error copying repository", err)
        console.log("copy body: ", body);

    });
}

export async function getRepositoryById(organizationName: string, repositoryId: string, azureToken: string) {
    const url = `https://dev.azure.com/${organizationName}/_apis/git/repositories/${repositoryId}?api-version=6.0`;
    const authHeader = getAuthHeader(azureToken);
    return axios.get(url, {headers: authHeader}).then(response => {
        console.log("getRepositoryById log : " + response)
        return response.data;
    });
}


export async function importRepository(organizationName: string, projectIdOrName: string,
                                       repositoryId: string, sourceUrl: string, token: string) {
    const url = `https://dev.azure.com/${organizationName}/${projectIdOrName}/_apis/git/repositories/${repositoryId}/importRequests?api-version=6.0-preview.1`
    const body = {
        parameters: {
            //TODO investigate effects
            deleteServiceEndpointAfterImportIsDone: true,
            gitSource: {
                url: sourceUrl
            }
        }
    }
    return axios.post(url, body, {headers: getAuthHeader(token)}).then((response) => {
        console.log("Import successful : ", response);
        return response;
    }).catch((err) => console.log("Error importing the repository", err));
}

export async function deleteRepository(organizationName: string, projectName: string, repositoryName: string, azureToken: string) {
    let repositoryId = await getRepositoryByName(repositoryName, azureToken).then(repository => repository.id);
    console.log("in delete repository id", repositoryId)
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/git/repositories/${repositoryId}?api-version=6.0`;
    const authHeader = getAuthHeader(azureToken);
    return axios.delete(url, {headers: authHeader}).then((response) => console.log(response));
}

//TODO maybe use decorators to avoid azureToken as parameter
export async function isRepositoryEmpty(repositoryName: string, azureToken: string): Promise<boolean> {
    return getRepositoryByName(repositoryName, azureToken).then(repository =>
        repository.size == 0
    );
}

export async function getRepositoryId(repositoryName: string, azureToken: string) {
    const repository = await getRepositoryByName(repositoryName, azureToken);
    return repository.id;
}
