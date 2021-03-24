import axios from "axios";
import DefinitionUtility from "./DefinitionUtility";
import {getDefaultAgentPool} from "./AgentPoolUtils";
import AzureUtility from "./AzureUtility";
import {appendAsyncConstructor} from "async-constructor/lib/es2017/append";
import RepositoryUtility from "./RepositoryUtility";

/**
 * Responsible for creating,triggering and deleting pipelines
 */
export default class PipelineUtility extends AzureUtility {
    private definitionUtility!: DefinitionUtility;
    private repositoryUtility!: RepositoryUtility;

    constructor(azureToken: string) {
        super(azureToken);
        appendAsyncConstructor(this, async () => {
            this.definitionUtility = await new DefinitionUtility(azureToken)
            this.repositoryUtility = await new RepositoryUtility(azureToken)
        });
    }

    /**
     * fetch all pipelines in a project
     */
    public async listPipelines() {
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/pipelines?api-version=6.0-preview.1`
        return axios.get(url, {headers: this.authHeader}).then((response: any) => {
            console.log("response of pipelines:", response)
            return response.data.value;
        });
    }

    /**
     * Used mainly to create pipelines.
     * It offers a more flexible way to search for yml files since the branchName can be a parameter
     */
    public async createPipelineWithBranch(repositoryName: string, pipelineName: string, path: string, branchName: string) {
        const defaultAgentPool = await getDefaultAgentPool(this.azureToken);
        const repositoryId = await this.repositoryUtility.getRepositoryId(repositoryName);
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/build/definitions?api-version=6.0`
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
                id: this.projectId,
                name: this.projectName
            },
            queue: defaultAgentPool
        }
        return axios.post(url, body, {headers: this.authHeader});
    }

    /**
     * Replace existing pipeline
     * @param repositoryName
     * @param branchName
     * @param pipelineName
     * @param ymlFilePath
     */
    public async deleteAndCreatePipeline(repositoryName: string, branchName: string, pipelineName: string, ymlFilePath: string) {
        const existingPipelines = await this.listPipelines().then(pipelines => {
            return pipelines.map((pipeline: any) => pipeline.name)
        });
        if (existingPipelines.includes(pipelineName)) {
            await this.deletePipeline(repositoryName, pipelineName)
        }
        return this.createPipelineWithBranch(repositoryName, pipelineName, ymlFilePath, branchName).then(response => {
            console.log("delete and create response:", response)
            return response.status;
        });
    }

    /**
     * Creates a pipeline from a yaml file in the default branch
     * Azure Rest API pipelines endpoint only create pipelines based on file on the default branch
     * @param repositoryName
     * @param pipelineName
     * @param ymlFilePath
     * @param azureToken
     */

    public async createPipelineWithDefaultBranch(repositoryName: string, pipelineName: string, ymlFilePath: string) {
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/pipelines?api-version=6.0-preview.1`;
        const repositoryId = await this.repositoryUtility.getRepositoryId(repositoryName);
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
        return axios.post(url, body, {headers: this.authHeader})
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
                }
            })
    }

    /**
     * Trigger a given pipeline
     * @param repositoryName
     * @param pipelineName
     * @param branchName
     */
    public async triggerPipeline(repositoryName: string, pipelineName: string, branchName: string) {
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/build/builds?api-version=6.0`
        const definition = await this.definitionUtility.getDefinitionByName(pipelineName);
        const body = {
            definition: {
                id: definition.id
            },
            sourceBranch: `refs/heads/${branchName}`
        }
        return axios.post(url, body, {headers: this.authHeader}).then((response) => response.status);
    }

    /**
     * delete a pipeline by name
     * @param repositoryName
     * @param pipelineName
     */
    public async deletePipeline(repositoryName: string, pipelineName: string) {
        const definition: any = await this.definitionUtility.getDefinitionByName(pipelineName);
        const definitionId = definition.id;
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/build/definitions/${definitionId}?api-version=6.0`
        axios.delete(url, {headers: this.authHeader}).then((response) => {
            console.log("pipeline deleted successfully")
            return response.status;
        });
    }

    public async generatePipelinesArray(repositoryName: string, pipelineNames: string[]) {
        let pipelinesArray = [];
        for (const pipelineName of pipelineNames) {
            let definition: any = await this.definitionUtility.getDefinitionByName(pipelineName)
            pipelinesArray.push({id: definition.id, authorized: true})
        }
        return pipelinesArray;
    }

    /**
     * grant pipeline permission to an endpoint.
     * required to trigger a pipeline
     * @param endpointId
     * @param repositoryName
     * @param pipelinesNames
     * @param azureToken
     */
    public async grantPipelinesPermissionToServiceEndpoint(endpointId: string, repositoryName: string, pipelinesNames: string[]) {
        console.log("permission granted for ", pipelinesNames);
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/pipelines/pipelinePermissions/endpoint/${endpointId}?api-version=6.0-preview.1`
        const body = {
            pipelines: await this.generatePipelinesArray(repositoryName, pipelinesNames)
            ,
            resource: {
                id: endpointId,
                type: "endpoint"
            }
        }
        return axios.patch(url, body, {headers: this.authHeader}).then(response => response.status);
    }
}