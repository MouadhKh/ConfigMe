import * as SDK from "azure-devops-extension-sdk";
import {BuildRestClient} from "azure-devops-extension-api/Build";
import {getClient} from "azure-devops-extension-api";
import {getCurrentProjectName} from "./ProjectUtils";
import {getOrganizationName} from "./OrganizationUtils";
import {getRepositoryId} from "./RepositoryUtils";
import {getAuthHeader} from "../auth";

export async function listDefinitions(projectNameOrId: string, definitionName?: string, repositoryId?: string) {
    //TODO find a better place for SDK.init()
    return SDK.init().then(() => {
            const buildClient: BuildRestClient = getClient(BuildRestClient);
            const token = SDK.getAccessToken();
            return token.then(() => buildClient.getDefinitions(projectNameOrId, definitionName, repositoryId));
        }
    );
}

export async function getDefinitionByName(repositoryName: string, definitionName: string, azureToken: string) {
    const projectName = await getCurrentProjectName();
    const repositoryId = await getRepositoryId(repositoryName, azureToken);
    const definitions = await listDefinitions(projectName, definitionName, repositoryId);
    //Strict equality here because getDefinitions() only follow a pattern(TODO investigate more here)
    const foundDefinitions = definitions.filter((definition: any) => definition.name === definitionName);
    if (foundDefinitions.length > 0) {
        console.log("found Definition", foundDefinitions[0]);
        return foundDefinitions[0];
    }
    return "DEFINITION_WITH_THIS_NAME_NOT_FOUND";
}
