import axios from "axios";
import AzureUtility from "./AzureUtility";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export default class QueueUtility extends AzureUtility {
    /**
     * Get queues , example : Build queues
     */
    public async listQueues() {
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/distributedtask/queues?api-version=6.0-preview.1`
        const response = axios.get(url, {headers: this.authHeader})
        return response.then((res) => {
                return res.data;
            }
        ).catch(err => console.log("fetching queues list failed with error: ", err))
    }
}