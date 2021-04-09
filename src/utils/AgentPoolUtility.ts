import axios from "axios";
import AzureUtility from "./AzureUtility";

export default class AgentPoolUtility extends AzureUtility {
    public async listAgentPools() {
        const url = `   https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/distributedtask/queues?api-version=6.0-preview.1`
        return axios.get(url, {headers: this.authHeader}).then(response => response.data.value);
    }

    public async getDefaultAgentPool() {
        const agentPools = await this.listAgentPools();
        return agentPools.filter((pool: any) => pool.name === "Default")[0];
    }
}