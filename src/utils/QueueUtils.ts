import axios from "axios";
import {getAuthHeader} from "./auth";

/**
 * Get queues , example : Build queues
 * @param organizationName
 * @param projectName
 * @param azureToken
 */
export async function getQueues(organizationName: string, projectName: string, azureToken: string) {
    const authHeader = getAuthHeader(azureToken);
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/distributedtask/queues?api-version=6.0-preview.1`
    const response = axios.get(url, {headers: authHeader})
    return response.then((res) => {
            console.log("Actual Queues: ", res.data);
            return res.data;
        }
    )
}
