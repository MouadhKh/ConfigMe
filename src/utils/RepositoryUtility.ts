import axios from 'axios';
import AzureUtility from "./AzureUtility";


export default class RepositoryUtility extends AzureUtility {
    constructor(azureToken: string) {
        super(azureToken);
    }

    /**
     * Create Repository on CURRENT project
     * The SDK variant is very bad documented.Couldn't get it to work
     * @param organizationName
     * @param projectId
     * @param repoName
     * @param skip
     */

    public async createRepository(repoName: string, skip: boolean = false) {
        //TODO delete the if
        if (skip) {
            return this.getRepositoryByName(repoName);
        }
        let body = {
            name: repoName,
            project: {
                id: this.projectId
            }
        }
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/git/repositories?api-version=6.0`;
        return axios.post(url, body, {headers: this.authHeader})
            .then((response) => {
                console.log(`Repo ${body.name} created successfully`)
                return response.data;
            }).catch(() => {
                console.log('url:' + url);
                console.log('header:' + this.authHeader);
                console.log('body:' + body.project.id);
                console.log(`Error creating ${body.name}`)
            });

    }


    public async listRepositories() {
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/git/repositories?api-version=6.0`
        return axios.get(url, {headers: this.authHeader})
            .then(response => response.data.value)
            .catch(err => "Error occured when fetching repositories" + err);
    }

    /**
     * Get Repository Object by name
     * Inefficient because we are listing all repo and extracting the one we need
     * There is no other option to get repositoryId by name
     * @param repositoryName
     */
    public async getRepositoryByName(repositoryName: string) {
        return await this.listRepositories()
            .then((repositories: any[]) => {
                const foundRepo = repositories.filter(repo => repo.name === repositoryName);
                if (foundRepo.length > 0) {
                    return foundRepo[0];
                } else {
                    console.log("No repository found with this name " + repositoryName)
                }
            })
            .catch((err) => console.log("Error fetching repository id ", err))
    }

    /**
     * Fetch repository by Id
     * @param repositoryId
     */
    public async getRepositoryById(repositoryId: string) {
        const url = `https://dev.azure.com/${this.organizationName}/_apis/git/repositories/${repositoryId}?api-version=6.0`;
        return axios.get(url, {headers: this.authHeader}).then(response => {
            console.log("getRepositoryById log : " + response)
            return response.data;
        });
    }

    /**
     * import repository from source url
     * @param repositoryId
     * @param sourceUrl
     */
    public async importRepository(repositoryId: string, sourceUrl: string) {
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectId}/_apis/git/repositories/${repositoryId}/importRequests?api-version=6.0-preview.1`
        const body = {
            parameters: {
                deleteServiceEndpointAfterImportIsDone: true,
                gitSource: {
                    url: sourceUrl
                }
            }
        }
        return axios.post(url, body, {headers: this.authHeader}).then((response) => {
            console.log("Import successful : ", response);
            return response;
        }).catch((err) => console.log("Error importing the repository", err));
    }

    /**
     * delete repository by name
     * @param repositoryName
     */
    public async deleteRepository(repositoryName: string) {
        let repositoryId = await this.getRepositoryId(repositoryName);
        console.log("in delete repository id", repositoryId)
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/git/repositories/${repositoryId}?api-version=6.0`;
        return axios.delete(url, {headers: this.authHeader}).then((response) => console.log(response));
    }

    /**
     * verify if repository is empty
     * @param repositoryName
     */
    public async isRepositoryEmpty(repositoryName: string): Promise<boolean> {
        return this.getRepositoryByName(repositoryName).then(repository =>
            repository.size == 0
        );
    }

    /**
     * get repository id
     * @param repositoryName
     */
    public async getRepositoryId(repositoryName: string) {
        const repository = await this.getRepositoryByName(repositoryName);
        return repository.id;
    }
}