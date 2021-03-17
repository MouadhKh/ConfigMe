import {getAuthHeader} from "../auth";
import axios from "axios";
import {getOrganizationName} from "./OrganizationUtils";
import {getCurrentProjectId, getCurrentProjectName} from "./ProjectUtils";


export async function listServiceEndpoints(azureToken: string) {
    const organizationName = await getOrganizationName();
    const projectName = await getCurrentProjectName();
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/serviceendpoint/endpoints?api-version=6.0-preview.4`
    const authHeader = getAuthHeader(azureToken)
    return axios.get(url, {headers: authHeader}).then(response => response.data.value);
}

export async function getServiceEndpointByName(serviceEndpointName: string, azureToken: string) {
    const serviceEndpoints = await listServiceEndpoints(azureToken);
    return serviceEndpoints.filter((endpoint: any) => endpoint.name === serviceEndpointName)[0];
}

export async function getServiceEndpointId(serviceEndpointName: string, azureToken: string) {
    const serviceEndpoint: any = await getServiceEndpointByName(serviceEndpointName, azureToken);
    return serviceEndpoint.id;

}

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
    return axios.post(url, body, {headers: authHeader}).then((response: any) => response.status);
}