import {getOrganizationName} from "./OrganizationUtils";
import {getCurrentProjectName} from "./ProjectUtils";
import {getAuthHeader} from "./auth";
import axios from "axios";


export async function listAgentPools(azureToken: string) {
    const organizationName = await getOrganizationName();
    const projectName = await getCurrentProjectName()
    const url = `   https://dev.azure.com/${organizationName}/${projectName}/_apis/distributedtask/queues?api-version=6.0-preview.1`
    const authHeader = getAuthHeader(azureToken);
    return axios.get(url, {headers: authHeader}).then(response => response.data.value);
}

export async function getDefaultAgentPool(azureToken: string) {
    const agentPools = await listAgentPools(azureToken);
    return agentPools.filter((pool: any) => pool.name === "Default")[0];
}