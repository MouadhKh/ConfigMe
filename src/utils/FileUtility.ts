import axios from "axios";
import RepositoryUtility from "./RepositoryUtility";
import AzureUtility from "./AzureUtility";
import {FileObject} from "./types";
import {appendAsyncConstructor} from "async-constructor/lib/es2017/append";
import BranchUtility from "./BranchUtility";

/**
 * Offers help methods to update,delete,push files
 */
export default class FileUtility extends AzureUtility {
    private repositoryUtility!: RepositoryUtility;
    private branchUtility!: BranchUtility;

    constructor(azureToken: string) {
        super(azureToken);
        appendAsyncConstructor(this, async () => {
            this.repositoryUtility = await new RepositoryUtility(azureToken);
            this.branchUtility = await new BranchUtility(azureToken);
        });
    }

    /**
     * Fetch all the files
     * @param repositoryName Repository to fetch files from
     * @param branchName Branch to fetch files from
     */
    public async getAllFiles(repositoryName: string, branchName: string) {
        const repositoryUtility = await new RepositoryUtility(this.azureToken);
        const repositoryId = await repositoryUtility.getRepositoryId(repositoryName);
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/git/repositories/${repositoryId}/items?recursionLevel=120&versionDescriptor.version=${branchName}&api-version=6.0`;
        return axios.get(url, {headers: this.authHeader}).then((response) => {
            return response.data.value
        });
    }

    /**
     * Get only the pipeline files(yml)
     * @param repositoryName Repository to fetch files from
     * @param branchName Branch to fetch files from
     */
    public async getPipelineFiles(repositoryName: string, branchName: string) {
        const files: any[] = await this.getAllFiles(repositoryName, branchName);
        return files.filter(fileObj => fileObj.path.includes(".yml")
        );
    }

    /**
     * Get only the Dockerfiles
     * @param repositoryName Repository to fetch files from
     * @param branchName Branch to fetch files from
     */
    public async getDockerFiles(repositoryName: string, branchName: string) {
        const files: any[] = await this.getAllFiles(repositoryName, branchName);
        return files.filter(fileObj => fileObj.gitObjectType === "blob" && fileObj.path.includes("Dockerfile"));
    }

    /**
     * Extract filename from a given path
     */
    public static extractFileName(path: string) {
        return path.substring(path.lastIndexOf("/") + 1)
    }

    /**
     * Get the content of a file
     * @param repositoryName repository that contains the file
     * @param fileObj FileObject
     */
    public async getFileData(repositoryName: string, fileObj: FileObject) {
        const sha1 = fileObj.objectId;
        const fileName = FileUtility.extractFileName(fileObj.path);
        const repositoryId = await this.repositoryUtility.getRepositoryId(repositoryName);
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/git/repositories/
    ${repositoryId}/blobs/${sha1}?$format=text&api-version=6.0`;
        return axios.get(url, {headers: this.authHeader}).then((response) => {
            return response.data;
        });
    }

    /**
     * Update and commit file changes
     * @param fileObj File Object
     * @param repositoryName Repository containing the file
     * @param branchName branch to push the file in
     * @param content new content
     * @returns statusCode
     */
    public async updateFile(fileObj: FileObject, repositoryName: string, branchName: string, content: string) {
        const repositoryId = await this.repositoryUtility.getRepositoryId(repositoryName);
        const comment = `updated ${FileUtility.extractFileName(fileObj.path)}`;
        const url = `https://dev.azure.com/${this.organizationName}/_apis/git/repositories/${repositoryId}/pushes?api-version=6.0`;
        const body = {
            refUpdates: [
                {
                    name: `refs/heads/${branchName}`,
                    oldObjectId: fileObj.commitId
                }
            ],
            commits: [
                {
                    comment: comment,
                    changes: [
                        {
                            changeType: "edit",
                            item: {
                                path: fileObj.path
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
        return axios.post(url, body, {headers: this.authHeader})
            .then((response) => {
                return response.status;

            })
            .catch((err) => {
                console.log("error:", err);
                return err;
            });
    }


    private buildCommentForMultipleFiles(files: FileObject[], verb: string) {
        return verb + " " + files.map(file => FileUtility.extractFileName(file.path)).join(",");
    }

    /**
     * Multiple files need to be pushed in one commits
     * @param files Set of files to change
     * @param contents
     * @param changeType "add" or "edit"
     * Use this function carefully since files & contents need to match
     */
    private static buildChangesForMultipleFiles(files: FileObject[], contents: string[], changeType: string) {
        let changes = [];
        for (let i = 0; i < files.length; i++) {
            changes.push({
                changeType: changeType,
                item: {
                    path: files[i].path
                },
                newContent: {
                    content: contents[i],
                    contentType: "rawtext"
                }
            });
        }
        return changes;
    }

    /**
     * Update an array of files
     * @param files array of files
     * @param repositoryName repository containing the files
     * @param branchName branch containing the file
     * @param contents array of contents
     */
    public async updateFiles(files: FileObject[], repositoryName: string, branchName: string, contents: string[]) {
        const repositoryId = await this.repositoryUtility.getRepositoryId(repositoryName);
        const comment = this.buildCommentForMultipleFiles(files, "updated");
        const url = `https://dev.azure.com/${this.organizationName}/_apis/git/repositories/${repositoryId}/pushes?api-version=6.0`;
        const body = {
            refUpdates: [
                {
                    name: `refs/heads/${branchName}`,
                    oldObjectId: files[0].commitId
                }
            ],
            commits: [
                {
                    comment: comment,
                    changes: FileUtility.buildChangesForMultipleFiles(files, contents, "edit")
                }
            ]
        }
        return axios.post(url, body, {headers: this.authHeader})
            .then((response) => {
                return response.status;

            })
            .catch((err) => {
                console.log("error:", err);
                return err;
            });
    }

    /**
     * Add new file
     * @param repositoryName repository to push the file to
     * @param branchName branch to push the file to
     * @param path Path to save the file in
     * @param content File Content
     */
    public async pushFile(repositoryName: string, branchName: string, path: string, content: string) {
        const repositoryId = await this.repositoryUtility.getRepositoryId(repositoryName);
        const comment = `added ${path}`;
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/git/repositories/${repositoryId}/pushes?api-version=6.0`;
        const oldObjectId = await this.branchUtility.getRefObjectId(repositoryName, `refs/heads/${branchName}`);
        console.log("oldobjId: ", oldObjectId);
        const body = {
            refUpdates: [
                {
                    name: `refs/heads/${branchName}`,
                    oldObjectId: oldObjectId
                }
            ],
            commits: [
                {
                    comment: comment,
                    changes: [
                        {
                            changeType: "add",
                            item: {
                                path: path
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
        return axios.post(url, body, {headers: this.authHeader})
            .then((response) => response.status)
            .catch((err => console.log("Error pushing the file:", err)));
    }

    /**
     * Delete file
     * @param repositoryName repository containing the file
     * @param branchName branch containing the file
     * @param fileObj fileObject to delete
     */
    public async deleteFile(repositoryName: string, branchName: string, fileObj: FileObject) {
        const repositoryId = await this.repositoryUtility.getRepositoryId(repositoryName);
        const comment = `deleted ${FileUtility.extractFileName(fileObj.path)}`;
        const oldObjectId = await this.branchUtility.getRefObjectId(repositoryName, `refs/heads/${branchName}`);
        const url = `https://dev.azure.com/${this.organizationName}/${this.projectName}/_apis/git/repositories/${repositoryId}/pushes?api-version=6.0`;
        const body = {
            refUpdates: [
                {
                    name: `refs/heads/${branchName}`,
                    oldObjectId: oldObjectId
                }
            ],
            commits: [
                {
                    comment: comment,
                    changes: [
                        {
                            changeType: "delete",
                            item: {
                                path: fileObj.path
                            }
                        }
                    ]
                }
            ]
        }
        return axios.post(url, body, {headers: this.authHeader});
    }
}