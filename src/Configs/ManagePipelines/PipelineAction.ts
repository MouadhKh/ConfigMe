import * as SDK from "azure-devops-extension-sdk";
import {getClient} from "azure-devops-extension-api";
import {BuildRestClient} from "azure-devops-extension-api/Build";
import {CoreRestClient} from "azure-devops-extension-api/Core";
import {createPipeline, triggerPipeline} from "../../utils/PipelineUtils";
import UIDialog from "../../UIInteractions/UIDialog";
import {createDockerRegistry} from "../../utils/ServiceEndpointUtils";
import {getCurrentProjectId, getCurrentProjectName} from "../../utils/ProjectUtils";
import {getOrganizationName} from "../../utils/OrganizationUtils";
import {getRepositoryByName} from "../../utils/RepositoryUtils";

class PipelineAction {

    //TODO : handle if pipeline already exists!!
    public async createPipeline(pipelineName: string, ymlFilePath: string, repositoryName: string) {
        const organizationName = await getOrganizationName();
        const projectName = await getCurrentProjectName();
        const repository = await getRepositoryByName(repositoryName);
        //todo make this dynamic
        createPipeline(organizationName, projectName,
            repository.id, pipelineName, ymlFilePath)
            .then(() => new UIDialog(`Pipeline created successfully`).showSimpleDialog());
    }

    public async triggerPipeline(pipelineName: string) {
        //Todo find suitable pattern to extract those as class property
        const organizationName = await getOrganizationName();
        const projectName = await getCurrentProjectName();
        triggerPipeline(organizationName, projectName, pipelineName)
            .then(() => new UIDialog(`Pipeline Build Queued successfully`).showSimpleDialog());
    }

    //TODO ,having username & password in code is a very very bad idea.Find a better solution
    public async createDockerRegistry(dockerRegistryName: string, username: string, password: string) {
        const organizationName = await getOrganizationName();
        const projectName = await getCurrentProjectName();
        const projectId = await getCurrentProjectId();
        createDockerRegistry(organizationName, projectId,
            projectName, dockerRegistryName, username, password)
            .then(() => new UIDialog(`Docker registry created successfully`).showSimpleDialog());

    }
}

export default PipelineAction;