import axios from "axios";
import {AUTH_HEADER} from '../auth';

export async function getQueues(organizationName: string, projectName: string) {
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/distributedtask/queues?api-version=6.0-preview.1`
    const response = axios.get(url, {headers: AUTH_HEADER})
    return response.then((res) => {
            console.log("Actual Queues: " , res.data);
            return res.data;
        }
    )
}
