import {getAuthHeader} from "../auth";
import axios from "axios";
import {getDefinitionByName} from "./DefinitionUtils";
import {getRepositoryId} from "./RepositoryUtils";
import {getCurrentProjectId, getCurrentProjectName} from "./ProjectUtils";
import {getOrganizationName} from "./OrganizationUtils";
import {getDefaultAgentPool} from "./AgentPoolUtils";

export async function listPipelines(azureToken: string) {
    const projectName = await getCurrentProjectName();
    const organizationName = await getOrganizationName();
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/pipelines?api-version=6.0-preview.1`
    const authHeader = getAuthHeader(azureToken);
    return axios.get(url, {headers: authHeader}).then((response: any) => {
        console.log("response of pipelines:", response)
        return response.data.value;
    });
}

/**
 * Used mainly to create pipelines.It offers a more flexible way to search for yml files since the branchName can be a parameter
 */
export async function createPipelineWithBranch(repositoryName: string, pipelineName: string, path: string, branchName: string, azureToken: string) {
    const organizationName = await getOrganizationName();
    const projectName = await getCurrentProjectName();
    const projectId = await getCurrentProjectId();
    const defaultAgentPool = await getDefaultAgentPool(azureToken);
    const repositoryId = await getRepositoryId(repositoryName, azureToken);
    const authHeader = getAuthHeader(azureToken);
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/build/definitions?api-version=6.0`
    const body = {
        process: {
            yamlFilename: path,
            type: 2
        },
        repository: {
            id: repositoryId,
            type: "TfsGit",
            name: repositoryName,

            defaultBranch: `refs/heads/${branchName}`,
            clean: null,
            checkoutSubmodules: false
        },

        name: pipelineName,

        path: "\\",
        type: "build",
        queueStatus: "enabled",

        project: {
            id: projectId,
            name: projectName
        },
        queue: defaultAgentPool
    }
    return axios.post(url, body, {headers: authHeader});
}

export async function deleteAndCreatePipeline(repositoryName: string, branchName: string, pipelineName: string, ymlFilePath: string, azureToken: string) {
    const existingPipelines = await listPipelines(azureToken).then(pipelines => {
        return pipelines.map((pipeline: any) => pipeline.name)
    });
    if (existingPipelines.includes(pipelineName)) {
        await deletePipeline(repositoryName, pipelineName, azureToken)
    }
    return createPipelineWithBranch(repositoryName, pipelineName, ymlFilePath, branchName, azureToken).then(response => {
        console.log("delete and create response:", response)
        return response.status;
    });
}

/**
 * @Unused
 * Azure Rest API pipelines endpoint only create pipelines based on file on the default branch
 * @param repositoryName
 * @param pipelineName
 * @param ymlFilePath
 * @param azureToken
 */
export async function createPipelineWithDefaultBranch(repositoryName: string, pipelineName: string, ymlFilePath: string, azureToken: string) {
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
        // Nice feature if we want to organize pipelines in folders
        folder: "\\"
    };
    return axios.post(url, body, {headers: authHeader})
        .then((response) => {
            console.log(`pipeline ${pipelineName} created successfully`);
            return response.status;
        })
        .catch((error) => {
            //Error handling
            if (error.response.status == 409) {
                console.log("Error occured.Possible reasons for this type of errors : \n" +
                    "1-Some of the pipeline files have the same name \n" +
                    "2- Pipeline with the same name already exists")
                return error.response.status;
            }
            if (error.request) {
                console.log("Internal Server Error: No Response received");
                // console.log("Internal Error, Retrying in 5 seconds");
                // setTimeout(() => {
                //     createPipeline(repositoryName, pipelineName, ymlFilePath, azureToken)
                // }, 5000);
            }
        })
}

export async function triggerPipeline(repositoryName: string, pipelineName: string, branchName: string, azureToken: string) {
    const projectName = await getCurrentProjectName();
    const organizationName = await getOrganizationName();
    // const repositoryId = await getRepositoryId(repositoryName, azureToken);
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/build/builds?api-version=6.0`
    const definition: any = await getDefinitionByName(pipelineName, azureToken);
    console.log("definition:", definition);
    const authHeader = getAuthHeader(azureToken);
    const body = {
        definition: {
            id: definition.id
        },
        sourceBranch: `refs/heads/${branchName}`
    }
    return axios.post(url, body, {headers: authHeader}).then((response) => response.status);
}

export async function deletePipeline(repositoryName: string, pipelineName: string, azureToken: string) {
    const organizationName = await getOrganizationName();
    const projectName = await getCurrentProjectName();
    const definition: any = await getDefinitionByName(pipelineName, azureToken);
    const definitionId = definition.id;
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/build/definitions/${definitionId}?api-version=6.0`
    const authHeader = getAuthHeader(azureToken);
    axios.delete(url, {headers: authHeader}).then((response) => {
        console.log("pipeline deleted successfully")
        return response.status;
    });
}

async function generatePipelinesArray(repositoryName: string, pipelineNames: string[], azureToken: string) {
    let pipelinesArray = [];
    for (const pipelineName of pipelineNames) {
        console.log("pipeline name", pipelineName);
        let definition: any = await getDefinitionByName(pipelineName, azureToken)
        pipelinesArray.push({id: definition.id, authorized: true})
    }
    console.log("pipelinesArray", pipelinesArray);
    return pipelinesArray;
}

/**
 *
 * @param endpointId : Id of the service endpoint , concretely here the docker registry endpoint id
 * @param repositoryName
 * @param pipelinesNames
 * @param azureToken
 */
export async function grantPipelinesPermissionToServiceEndpoint(endpointId: string, repositoryName: string, pipelinesNames: string[], azureToken: string) {
    const projectName = await getCurrentProjectName();
    const organizationName = await getOrganizationName();
    const authHeader = getAuthHeader(azureToken);
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/pipelines/pipelinePermissions/endpoint/${endpointId}?api-version=6.0-preview.1`
    const body = {
        pipelines: await generatePipelinesArray(repositoryName, pipelinesNames, azureToken)
        ,
        resource: {
            id: endpointId,
            type: "endpoint"
        }
    }
    return axios.patch(url, body, {headers: authHeader}).then(response => response.status);
}