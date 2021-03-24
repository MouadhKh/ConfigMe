import axios from "axios";
import AzureUtility from "./AzureUtility";
import {ServiceEndpoint} from "azure-devops-extension-api/ServiceEndpoint";

/**
 * fetch & create ServiceEndpoint
 */
export default class ServiceEndpointUtility extends AzureUtility {
    /**
     * fetch all available endpoints
     */
    public async listServiceEndpoints() {
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/serviceendpoint/endpoints?api-version=6.0-preview.4`
        return axios.get(url, {headers: this.authHeader}).then(response => response.data.value);
    }

    /**
     * get service endpoint object by name
     * @param serviceEndpointName
     */
    public async getServiceEndpointByName(serviceEndpointName: string): Promise<ServiceEndpoint> {
        const serviceEndpoints = await this.listServiceEndpoints();
        return serviceEndpoints.filter((endpoint: any) => endpoint.name === serviceEndpointName)[0];
    }

    /**
     * fetch the id of a given service endpoint
     * @param serviceEndpointName
     */
    public async getServiceEndpointId(serviceEndpointName: string) {
        const serviceEndpoint: ServiceEndpoint = await this.getServiceEndpointByName(serviceEndpointName);
        return serviceEndpoint.id;

    }

    /**
     * Create a docker registry endpoint
     * @param dockerRegistryName
     * @param username
     * @param password
     */
    public async createDockerRegistry(dockerRegistryName: string, username: string, password: string) {
        const url = `https://dev.azure.com/${this.organizationName}/_apis/serviceendpoint/endpoints?api-version=6.0-preview.4`

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
                        id: this.projectId,
                        name: this.projectName
                    },
                    name: dockerRegistryName
                }
            ]
        }
        return axios.post(url, body, {headers: this.authHeader}).then((response: any) => response.status);
    }
}