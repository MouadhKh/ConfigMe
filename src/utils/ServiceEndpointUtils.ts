import * as SDK from "azure-devops-extension-sdk";
import {getClient} from "azure-devops-extension-api";
import {ServiceEndpoint, ServiceEndpointRestClient} from "azure-devops-extension-api/ServiceEndpoint";
import {getAuthHeader} from "../auth";
import axios from "axios";
import {azureAuthReducer} from "../Configs/ConfigWizard/statemanagement/reducers/authReducer";
import {getOrganizationName} from "./OrganizationUtils";
import {getRepositoryId} from "./RepositoryUtils";
import {getCurrentProjectId, getCurrentProjectName} from "./ProjectUtils";

// TODO refactor sdk variant
// export async function createServiceEndpointWithSDK(projectNameOrId: string, definitionName?: string, repositoryId?: string) {
//     //TODO find a better place for SDK.init()
//     return SDK.init().then(() => {
//             const serviceEndpointClient: ServiceEndpointRestClient = getClient(ServiceEndpointRestClient);
//             const token = SDK.getAccessToken();
//             // return token.then(() => serviceEndpointClient.createServiceEndpoint({}, projectNameOrId));
//         }
//     );
// }

export async function createDockerRegistry(azureToken: string, dockerRegistryName: string, username: string, password: string) {

    const organizationName = await getOrganizationName();
    const projectName = await getCurrentProjectName();
    const projectId = await getCurrentProjectId();
    const authHeader = getAuthHeader(azureToken);
    const url = `https://dev.azure.com/${organizationName}/_apis/serviceendpoint/endpoints?api-version=6.0-preview.4`

    const body = {
        data: {
            registryType: "Others"
        },
        name: dockerRegistryName,
        type: "dockerregistry",
        url: "https://index.docker.io/v1/",
        authorization: {
            parameters: {
                username: username,
                password: password,
                registry: "https://index.docker.io/v1/"
            },
            scheme: "UsernamePassword"
        },
        isShared: false,
        isReady: true,
        //can customize this more
        serviceEndpointProjectReferences: [
            {
                projectReference: {
                    id: projectId,
                    name: projectName
                },
                name: dockerRegistryName
            }
        ]
    }
    return axios.post(url, body, {headers: authHeader}).then(() => console.log("docker registry created successfully"))
}