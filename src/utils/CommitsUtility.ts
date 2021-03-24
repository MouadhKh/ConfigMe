import RepositoryUtility from "./RepositoryUtility";

import axios from "axios";
import AzureUtility from "./AzureUtility";
import {appendAsyncConstructor} from "async-constructor/lib/es2017/append";

export default class CommitsUtility extends AzureUtility {
    private repositoryUtility!: RepositoryUtility;

    constructor(azureToken: string) {
        super(azureToken);
        appendAsyncConstructor(this, async () => {
            this.repositoryUtility = new RepositoryUtility(azureToken);
        });
    }

    /**
     * Fetch all commits in a given repository
     * @param repositoryName
     */
    public async getCommits(repositoryName: string) {
        const repositoryId = await this.repositoryUtility.getRepositoryId(repositoryName);
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/git/repositories/${repositoryId}/commits?api-version=6.0`
        return axios.get(url, {headers: this.authHeader});
    }

    /**
     * Get last commit in a given repository
     * @param repositoryName
     */
    public async getLastCommit(repositoryName: string) {
        const commits = await this.getCommits(repositoryName)

        if (commits.data.value.length) {
            return commits.data.value[commits.data.value.length - 1];
        }
        return "ERROR_RETRIEVING_COMMIT";
    }
}
