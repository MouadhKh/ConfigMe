import axios from "axios";
import AzureUtility from "./AzureUtility";

export default class DefinitionUtility extends AzureUtility {

    /**
     * Get all build definitions on the current project
     */
    public async listDefinitions() {
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/build/definitions?api-version=6.0`
        return axios.get(url, {headers: this.authHeader}).then(response => {
            return response.data.value;
        });
    }

    /**
     * Find build definition by name
     */
    public getDefinitionByName(definitionName: string) {
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/build/definitions?name=${definitionName}&api-version=6.0`
        return axios.get(url, {headers: this.authHeader}).then((response: any) => {
            console.log("response:", response);
            if (response.data.value.length > 0) {
                return response.data.value[0];
            } else
                return "DEFINITION_NOT_FOUND";
        });
    }
}
