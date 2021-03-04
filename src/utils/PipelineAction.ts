// import * as SDK from "azure-devops-extension-sdk";
// import {getClient} from "azure-devops-extension-api";
// import {BuildRestClient} from "azure-devops-extension-api/Build";
// import {CoreRestClient} from "azure-devops-extension-api/Core";
// import {getCurrentProjectId, getCurrentProjectName} from "./ProjectUtils";
// import {getRepositoryByName} from "./RepositoryUtils";
// import {getOrganizationName} from "./OrganizationUtils";
// import {createPipeline, triggerPipeline} from "./PipelineUtils";
// import {createDockerRegistry} from "./ServiceEndpointUtils";
//
// class PipelineAction {
//
//     //TODO : handle if pipeline already exists!!
//     public async createPipeline(pipelineName: string, ymlFilePath: string, repositoryName: string, azureToken: string) {
//         const organizationName = await getOrganizationName();
//         const projectName = await getCurrentProjectName();
//         //todo make this dynamic
//         createPipeline(repositoryName, pipelineName, ymlFilePath, azureToken)
//             .then(() => console.log("pipeline created successfully"));
//     }
//
//     //TODO use decorator for organizationName....
//     public async triggerPipeline(repositoryName: string, pipelineName: string, azureToken: string) {
//         //Todo find suitable pattern to extract those as class property
//         const organizationName = await getOrganizationName();
//         const projectName = await getCurrentProjectName();
//         triggerPipeline(repositoryName, pipelineName, azureToken)
//             .then(() => console.log("pipeline triggered successfully"));
//     }
//
//     //TODO ,having username & password in code is a very very bad idea.Find a better solution
//     public async createDockerRegistry(dockerRegistryName: string, username: string, password: string) {
//         const organizationName = await getOrganizationName();
//         const projectName = await getCurrentProjectName();
//         const projectId = await getCurrentProjectId();
//
//         createDockerRegistry(organizationName, projectId,
//             projectName, dockerRegistryName, username, password)
//             .then(() => console.log(`Docker registry created successfully`));
//
//     }
// }
//
// export default PipelineAction;