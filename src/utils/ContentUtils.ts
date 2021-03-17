import {GitRestClient, VersionControlRecursionType} from "azure-devops-extension-api/Git";
import {getClient} from "azure-devops-extension-api";
import {getAuthHeader} from "../auth";
import {getCurrentProjectName} from "./ProjectUtils";
import {getOrganizationName} from "./OrganizationUtils";
import axios from "axios";
import {getRepositoryId} from "./RepositoryUtils";
import {getRefObjectId} from "./BranchUtils";
import {getLastCommit} from "./CommitsUtils";

// export async function getAllItems(projectName: string, repositoryId: string) {
//     const gitClient: GitRestClient = await getClient(GitRestClient);
//     return gitClient.getItems(repositoryId, projectName, "/", VersionControlRecursionType.Full);
// }
export async function getAllFiles(repositoryName: string, branchName: string, azureToken: string) {
    const projectName = await getCurrentProjectName();
    const organizationName = await getOrganizationName();
    const repositoryId = await getRepositoryId(repositoryName, azureToken);
    const authHeader = getAuthHeader(azureToken);
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/git/repositories/${repositoryId}/items?recursionLevel=120&versionDescriptor.version=${branchName}&api-version=6.0`;
    // const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/git/repositories/${repositoryId}/items?recursionLevel=120&includeContent=${includeContent}&api-version=6.0`;
    return axios.get(url, {headers: authHeader}).then((response) => {
        return response.data.value
    });
}

export type FileObject = {
    commitId: string
    gitObjectType: string
    isFolder?: string
    objectId: string
    path: string
    url: string
}

export async function getPipelineFiles(repositoryName: string, branchName: string, azureToken: string) {
    const files: any[] = await getAllFiles(repositoryName, branchName, azureToken);
    return files.filter(fileObj => fileObj.path.includes(".yml")
    );
}

export async function getDockerFiles(repositoryName: string, branchName: string, azureToken: string) {
    const files: any[] = await getAllFiles(repositoryName, branchName, azureToken);
    return files.filter(fileObj => fileObj.gitObjectType === "blob" && fileObj.path.includes("Dockerfile"));
}

export function extractFileName(path: string) {
    return path.substring(path.lastIndexOf("/") + 1)
}

export async function getFileData(repositoryName: string, fileObj: FileObject, azureToken: string) {
    const sha1 = fileObj.objectId;
    const fileName = extractFileName(fileObj.path);
    console.log("filename", fileName);
    const organizationName = await getOrganizationName();
    const repositoryId = await getRepositoryId(repositoryName, azureToken);
    const projectName = await getCurrentProjectName();
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/git/repositories/
    ${repositoryId}/blobs/${sha1}?$format=text&api-version=6.0`;
    const authHeader = getAuthHeader(azureToken);
    return axios.get(url, {headers: authHeader}).then((response) => {
        return response.data;
    });
}

/**
 * returns status code
 * @param fileObj
 * @param repositoryName
 * @param branchName
 * @param content
 * @param azureToken
 */
export async function updateFile(fileObj: FileObject, repositoryName: string, branchName: string, content: string, azureToken: string) {
    const organizationName = await getOrganizationName();
    const repositoryId = await getRepositoryId(repositoryName, azureToken);
    const authHeader = getAuthHeader(azureToken);
    const comment = `updated ${extractFileName(fileObj.path)}`;
    const url = `https://dev.azure.com/${organizationName}/_apis/git/repositories/${repositoryId}/pushes?api-version=6.0`;
    // const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/git/repositories/${repositoryId}/pushes?api-version=6.0`;
    // const sourceBranchId=getRefObjectId(organizationName,projectName,repositoryId,fileObj,azureToken)
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
    return axios.post(url, body, {headers: authHeader})
        .then((response) => {
            return response.status;

        })
        .catch((err) => {
            console.log("error:", err);
            return err;
        });
}

function buildCommentForMultipleFiles(files: FileObject[], verb: string) {
    return verb + " " + files.map(file => extractFileName(file.path)).join(",");
}

/**
 * Use this function carefully since files & contents need to match
 * @param files
 * @param contents
 * @param changeType
 */
function buildChangesForMultipleFiles(files: FileObject[], contents: string[], changeType: string) {
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

export async function updateFiles(files: FileObject[], repositoryName: string, branchName: string, contents: string[], azureToken: string) {
    const organizationName = await getOrganizationName();
    const repositoryId = await getRepositoryId(repositoryName, azureToken);
    const authHeader = getAuthHeader(azureToken);
    const comment = buildCommentForMultipleFiles(files, "updated");
    const url = `https://dev.azure.com/${organizationName}/_apis/git/repositories/${repositoryId}/pushes?api-version=6.0`;
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
                changes: buildChangesForMultipleFiles(files, contents, "edit")
            }
        ]
    }
    return axios.post(url, body, {headers: authHeader})
        .then((response) => {
            return response.status;

        })
        .catch((err) => {
            console.log("error:", err);
            return err;
        });
}

export async function pushFile(repositoryName: string, branchName: string, path: string, content: string, azureToken: string) {
    const organizationName = await getOrganizationName();
    const repositoryId = await getRepositoryId(repositoryName, azureToken);
    const projectName = await getCurrentProjectName();
    const authHeader = getAuthHeader(azureToken);
    const comment = `added ${path}`;
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/git/repositories/${repositoryId}/pushes?api-version=6.0`;
    // const sourceBranchId=getRefObjectId(organizationName,projectName,repositoryId,fileObj,azureToken)
    // const oldObjectId = await getLastCommit(repositoryName, azureToken).then(commit => commit.commitId);
    const oldObjectId = await getRefObjectId(repositoryName, `refs/heads/${branchName}`, azureToken);
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
    return axios.post(url, body, {headers: authHeader})
        .then((response) => response.status)
        .catch((err => console.log("Error pushing the file:", err)));
}

export async function deleteFile(repositoryName: string, branchName: string, fileObj: FileObject, azureToken: string) {
    const organizationName = await getOrganizationName();
    const repositoryId = await getRepositoryId(repositoryName, azureToken);
    const projectName = await getCurrentProjectName();
    const comment = `deleted ${extractFileName(fileObj.path)}`;
    const oldObjectId = await getRefObjectId(repositoryName, `refs/heads/${branchName}`, azureToken);
    const authHeader = getAuthHeader(azureToken);
    const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/git/repositories/${repositoryId}/pushes?api-version=6.0`;
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
    return axios.post(url, body, {headers: authHeader});

}