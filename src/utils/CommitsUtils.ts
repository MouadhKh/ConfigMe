import {getOrganizationName} from "./OrganizationUtils";
import {getRepositoryId} from "./RepositoryUtils";
import {getCurrentProjectName} from "./ProjectUtils";
import {getAuthHeader} from "../auth";
import axios from "axios";

export async function getCommits(repositoryName: string, azureToken: string) {
    const organizationName = await getOrganizationName();
    const repositoryId = await getRepositoryId(repositoryName, azureToken);
    const projectName = await getCurrentProjectName();
    const authHeader = getAuthHeader(azureToken);
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/git/repositories/${repositoryId}/commits?api-version=6.0`
    return axios.get(url, {headers: authHeader});
}

export async function getLastCommit(repositoryName: string, azureToken: string) {
    const commits = await getCommits(repositoryName, azureToken)

    if (commits.data.value.length) {
        return commits.data.value[commits.data.value.length - 1];
    }
    return "ERROR_RETRIEVING_COMMIT"
}
