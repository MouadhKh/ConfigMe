import {AUTH_HEADER} from "../auth";
import axios from "axios";
import {getDefinitionByName} from "./DefinitionUtils";

export function createPipeline(organizationName: string, projectNameOrId: string, repositoryId: string, pipelineName: string, ymlFilePath: string,) {
    const url = `https://dev.azure.com/${organizationName}/${projectNameOrId}/_apis/pipelines?api-version=6.0-preview.1`;
    const body = {
        configuration: {
            path: ymlFilePath,
            repository: {
                id: repositoryId,
                //TODO change later
                name: "ConfigTest",
                type: "azureReposGit"
            },
            type: "yaml"
        },
        name: pipelineName,
        //TODO this can cause problems : debug
        folder: "\\"
    };
    return axios.post(url, body, {headers: AUTH_HEADER})
        .then(() => console.log(`pipeline ${pipelineName} created successfully`))
        .catch((err) => console.log(`Following error interrupted pipeline creation ${err}`))
}

export async function triggerPipeline(organizationName: string, projectNameOrId: string, pipelineName: string) {
    const url = `https://dev.azure.com/${organizationName}/${projectNameOrId}/_apis/build/builds?api-version=6.0`
    const definition: any = await getDefinitionByName(projectNameOrId, pipelineName);
    const body = {
        //TODO very dangerous, save everything to environment
        // + popup asking for credentials(still dangerous, maybe Token Scheme would be better)
        definition: {
            id: definition.id
        }
    }
    return axios.post(url, body, {headers: AUTH_HEADER}).then(() => console.log("pipeline trigger queued "))
}