import {AUTH_HEADER, getAuthHeader} from "../auth";
import axios from "axios";
import {getDefinitionByName} from "./DefinitionUtils";
import {getRepositoryId} from "./RepositoryUtils";
import {getCurrentProjectName} from "./ProjectUtils";
import {getOrganizationName} from "./OrganizationUtils";

export async function createPipeline(repositoryName: string, pipelineName: string, ymlFilePath: string, azureToken: string) {
    const projectName = await getCurrentProjectName();
    const organizationName = await getOrganizationName();
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/pipelines?api-version=6.0-preview.1`;
    const repositoryId = await getRepositoryId(repositoryName, azureToken);
    const authHeader = getAuthHeader(azureToken);
    const body = {
        configuration: {
            path: ymlFilePath,
            repository: {
                id: repositoryId,
                name: repositoryName,
                type: "azureReposGit"
            },
            type: "yaml"
        },
        name: pipelineName,
        //TODO this can cause problems : debug
        folder: "\\"
    };
    return axios.post(url, body, {headers: authHeader})
        .then(() => console.log(`pipeline ${pipelineName} created successfully`))
        .catch((err) => console.log(`Following error interrupted pipeline creation ${err}`))
}

export async function triggerPipeline(repositoryName: string, pipelineName: string, azureToken: string) {
    const projectName = await getCurrentProjectName();
    const organizationName = await getOrganizationName();
    const repositoryId = await getRepositoryId(repositoryName, azureToken);
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/build/builds?api-version=6.0`
    const definition: any = await getDefinitionByName(repositoryName, pipelineName, azureToken);
    const authHeader = getAuthHeader(azureToken);
    const body = {
        //TODO very dangerous, save everything to environment
        // + popup asking for credentials(still dangerous, maybe Token Scheme would be better)
        definition: {
            id: definition.id
        }
    }
    return axios.post(url, body, {headers: authHeader}).then(() => console.log("pipeline trigger queued "))
}

export async function deletePipeline(repositoryName: string, pipelineName: string, azureToken: string) {
    //TODO debug this
    const buildId = getDefinitionByName(repositoryName, pipelineName, azureToken).then((response) => (console.log(response)));
    const url = `https://dev.azure.com/{organization}/{project}/_apis/build/builds/${buildId}?api-version=6.0`
    const authHeader = getAuthHeader(azureToken);
    axios.delete(url, {headers: authHeader}).then(() => console.log("pipeline deleted successfully"));
}