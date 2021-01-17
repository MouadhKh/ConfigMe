import * as SDK from "azure-devops-extension-sdk";
import {getClient} from "azure-devops-extension-api";
import {ServiceEndpoint, ServiceEndpointRestClient} from "azure-devops-extension-api/ServiceEndpoint";
import {AUTH_HEADER} from "../auth";
import axios from "axios";

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

export async function createDockerRegistry(organizationName: string, projectId: string, projectName: string, dockerRegistryName: string, username: string, password: string) {
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
                //TODO very dangerous, save everything to environment
                // + popup asking for credentials(still dangerous, maybe Token Scheme would be better)
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

    return axios.post(url, body, {headers: AUTH_HEADER}).then(() => console.log("docker registry created successfully"))
}