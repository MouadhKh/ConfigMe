import {getOrganizationName} from "./OrganizationUtils";
import {getCurrentProjectName} from "./ProjectUtils";

import axios from "axios";
import {getAuthHeader} from "./auth";

export async function listPushes(repositoryId: string, azureToken: string) {
    const organizationName = await getOrganizationName();
    const projectName = await getCurrentProjectName();
    const authHeader = getAuthHeader(azureToken)
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/git/repositories/${repositoryId}/pushes?api-version=6.0`
    return axios.get(url, {headers: authHeader}).then((response) => console.log("Pushes debug log", response))
}

