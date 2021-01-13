import { getClient } from "azure-devops-extension-api";
import { getProjectId, getProjectName } from "./ProjectUtils";
import { GitRestClient } from "azure-devops-extension-api/Git";
import * as SDK from "azure-devops-extension-sdk";
import axios from 'axios';
import { AUTH_HEADER } from "../auth";

const ENDPOINT = "https://dev.azure.com/ORG_NAME/PROJECT_NAME/_apis/git/repositories?api-version=6.0";

/**
 * create "CreateRepository" Axios Requests dynamically
 * @param url 
 * @param repositoriesNames 
 */
export async function getCreateRepositoriesRequestArray(organizationName: string, projectName: string, repositoriesNames: string[]) {
    return repositoriesNames.map(repoName => createRepository(organizationName,projectName,repoName));
}

/**
 * Create Repository 
 * The SDK variant is very bad documented.Couldn't get it to work
 * @param repoName 
 * @param url 
 */

export async function createRepository(organizationName: string, projectName: string, repoName: string) {
    let body = {
        "name": repoName,
        "project": {
            "id": await getProjectId()
        }
    }
    const url = ENDPOINT.split("PROJECT_NAME").join(projectName).split("ORG_NAME").join(organizationName);
    return axios.post(url, body, { headers: AUTH_HEADER })
        .then(response => console.log(`Repo ${body.name} created successfully`))
        .catch(() => {
            console.log('url:' + url);
            console.log('header:' + AUTH_HEADER.Authorization);
            console.log('body:' + body.project.id);
            console.log(`Error creating ${body.name}`)
        });
}

export function listRepositories(projectId: string) {

    const gitClient = getClient(GitRestClient);
    gitClient.getRepositories(projectId).then((response) => {
        console.log(response);
    }).catch((err) => console.log("error fetching repository list:" + err))

}
SDK.init();