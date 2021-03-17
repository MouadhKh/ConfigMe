import * as SDK from "azure-devops-extension-sdk";
import {BuildRestClient} from "azure-devops-extension-api/Build";
import {getClient} from "azure-devops-extension-api";
import {getCurrentProjectName} from "./ProjectUtils";
import {getOrganizationName} from "./OrganizationUtils";
import {getRepositoryId} from "./RepositoryUtils";
import {getAuthHeader} from "../auth";
import axios from "axios";

//TODO rename to get Definition
export async function listDefinitions(azureToken: string) {
    const organizationName = await getOrganizationName();
    const projectName = await getCurrentProjectName();
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/build/definitions?api-version=6.0`
    const authHeader = getAuthHeader(azureToken);
    return axios.get(url, {headers: authHeader}).then(response => {
        return response.data.value;
    });
}



export async function getDefinitionByName(definitionName: string, azureToken: string) {
    const projectName = await getCurrentProjectName();
    const organizationName = await getOrganizationName();
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/build/definitions?name=${definitionName}&api-version=6.0`
    const authHeader = getAuthHeader(azureToken);
    return axios.get(url, {headers: authHeader}).then((response: any) => {
        console.log("response:", response);
        if (response.data.value.length > 0) {
            return response.data.value[0];
        } else
            return "DEFINITION_NOT_FOUND";
    });
}
