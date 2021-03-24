import axios from "axios";
import AzureUtility from "./AzureUtility";
import {appendAsyncConstructor} from "async-constructor/lib/es2017/append";
import RepositoryUtility from "./RepositoryUtility";

export default class BranchUtility extends AzureUtility {

    public async listBranches() {
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectId}/_apis/tfvc/branches?path=$/&api-version=6.0`
        return axios.get(url, {headers: this.authHeader}).then((response) => {
            console.log(response.data);
            return response.data;
        });
    }


    /**
     * Create an empty branch initialized by a README file
     * @param repositoryName
     * @param content : initialization file content
     * @param sourceBranchId : If not set an empty branch is created
     * @param branchName : branch to create
     * @param comment : commit comment
     */
    public async createBranch(repositoryName: string, branchName: string,
                              comment: string, content: string, sourceBranchId?: string) {
        const repositoryUtility = await new RepositoryUtility(this.azureToken);
        const repositoryId = repositoryUtility.getRepositoryId(repositoryName);
        const url = `https://dev.azure.com/${this.organizationName}/_apis/git/repositories/${repositoryId}/pushes?api-version=6.0`;
        //if sourceBranchId is not given then that means we start a fresh branch
        sourceBranchId = (typeof sourceBranchId !== "undefined") ? sourceBranchId : "0000000000000000000000000000000000000000";
        const body = {
            refUpdates: [
                {
                    name: `refs/heads/${branchName}`,
                    oldObjectId: sourceBranchId
                }
            ],
            commits: [
                {
                    comment: comment,
                    changes: [
                        {
                            changeType: "add",
                            item: {
                                path: "/readme.md"
                            },
                            newContent: {
                                content: content,
                                contentType: "rawtext"
                            }
                        }
                    ]
                }
            ]
        }
        const response = axios.post(url, body, {headers: this.authHeader});
        return response.then((res) => {
            console.log(`Branch ${branchName} created successfully`)
            return res.data;
        }).catch((err) => console.log(`error when creating branch ${branchName}: ${err}`))

    }

    /**
     * get a list of refs
     * @param repositoryName repository to search refs in
     */
    public async getRefs(repositoryName: string) {
        const repositoryUtility = await new RepositoryUtility(this.azureToken);
        const repositoryId = await repositoryUtility.getRepositoryId(repositoryName);
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/git/repositories/${repositoryId}/refs?api-version=6.0`;
        return axios.get(url, {headers: this.authHeader}).then(response => response.data.value);
    }

    /**
     * Get the last commitId in a branch
     * @param repositoryName
     * @param refName
     */
    public async getRefObjectId(repositoryName: string, refName: string) {
        const refs = await this.getRefs(repositoryName);
        const foundRef = refs.filter((ref: any) => ref.name === refName);
        if (foundRef.length > 0) {
            return foundRef[0].objectId;
        }
    }

    /**
     * Get branch name from refs
     * @param refString
     * @private
     */
    private static extractBranchName(refString: string): string {
        return refString.substring(refString.lastIndexOf("/") + 1);
    }

    /**
     * fetch Branch names
     * @param repositoryName
     */
    public async getBranchNames(repositoryName: string) {
        return this.getRefs(repositoryName).then(refs => {
            return refs.map((ref: any) => BranchUtility.extractBranchName(ref.name))
        });
    }
}
