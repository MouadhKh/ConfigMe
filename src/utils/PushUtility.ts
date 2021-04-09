import axios from "axios";
import AzureUtility from "./AzureUtility";

export default class PushUtility extends AzureUtility {
    public async listPushes(repositoryId: string) {
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/git/repositories/${repositoryId}/pushes?api-version=6.0`
        return axios.get(url, {headers: this.authHeader}).then((response) => console.log("Pushes debug log", response))
    }
}

